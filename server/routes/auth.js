const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const passport = require("passport");
const nodemailer = require("nodemailer");
const templates = require("../templates/template");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const login = (req, user) => {
  return new Promise((resolve, reject) => {
    req.login(user, err => {
      if (err) {
        reject(new Error("Something went wrong"));
      } else {
        resolve(user);
      }
    });
  });
};

// SIGNUP
router.post("/signup", (req, res, next) => {
  const { username, password, name, surname, email, phone } = req.body;

  // console.log('username', username)
  // console.log('password', password)
  // console.log('name', name)
  // console.log('surname', surname)
  // console.log('email', email)
  // console.log('phone', phone)

  // Check for non empty user or password
  if (!username || !password) {
    next(new Error("You must provide valid credentials"));
  }

  // Check if user exists in DB
  User.findOne({ username }, (err, foundUser) => {
    if (foundUser) throw new Error("Username already exists");

    const characters =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let token = "";

    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }

    const confirmCode = token;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      name,
      surname,
      email,
      phone,
      password: hashPass,
      confirmCode
    });

    newUser
      .save()
      .then( user => {
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
          }
        });

        const port = process.env.PORT;

        const message = {
          from: `Nodemailer Enterprise <${process.env.EMAIL}>`,
          to: email,
          subject: "Nodemailer Enterprise verification",
          text: `Verify your account here: http://localhost:${port}/auth/confirm/${confirmCode}`,
          html: templates.template(username, port, confirmCode)
        };

        transporter.sendMail(message);
      })
      .catch(e => next(e));
  })
    .then(savedUser => login(req, savedUser)) // Login the user using passport
    .then(user => res.json({ status: "signup & login successfully", user })) // Answer JSON
    .catch(e => {
      console.log(e);
      next(e);
    });
});

router.get("/confirm/:confirmCode", (req, res, next) => {
    const confirmCode = req.params.confirmCode;
    User.findOneAndUpdate({ confirmationCode: confirmCode }, {status: "active"}, {new: true})
      .then(user => {
        res.status(200).redirect('http://localhost:3000')
      }
      )
      .catch(err => console.log(err));
  });

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, theUser, failureDetails) => {
    // Check for errors
    if (err) next(new Error("Something went wrong"));
    if (!theUser) next(failureDetails);

    // Return user and logged in
    login(req, theUser).then(user => res.status(200).json(req.user));
  })(req, res, next);
});

router.get("/currentuser", (req, res, next) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    next(new Error("Not logged in"));
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.status(200).json({ message: "logged out" });
});

router.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = router;
