const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const passport = require("passport");
const nodemailer = require("nodemailer");
const templates = require("../templates/template");

// Bcrypt to encrypt passwords
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
    if (foundUser) {
      res.status(500).json({ errorMsg: "Username already exists" });
      return
    }

    require('../helpers/regularExpressions.js')();
    const mailGood = validateMail(email);
    const passwordGood = validatePassword(password);

    if (!mailGood) {
      res.status(500).json({ errorMsg: "Use a valid mail" });
      return
    }

    if (!passwordGood) {
      res.status(500).json({ errorMsg: "The password must contain from 8 to 16 characters and at least 1 digit and character" });
      return
    }

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
      .then(user => {
        let transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
          }
        });

        const port = process.env.PORT;

        const message = {
          from: `Nodemailer Enterprise`,
          to: email,
          subject: "Nodemailer Enterprise verification",
          text: `Verify your account here: http://localhost:${port}/auth/confirm/${confirmCode}`,
          html: templates.template(username, port, confirmCode)
        };

        transporter.sendMail(message);

        login(req, user)
          .then( () => {
            console.log("WIN")
            res.json({ status: "signup & login successfully", user });
          })
          .catch(error => {
            console.log("FAILED CAUSE OF: ", error)
            // res.status(500).json({
            //   status: "login failed",
            //   error
            // })
          });
      })
      .catch(err => console.log("FINAL ERROR: ", err));
  })
  .catch(err => console.log("FINAL ERROR: ", err));
});

router.get("/confirm/:confirmCode", async (req, res, next) => {
  const confirmCode = req.params.confirmCode
  await User.findOneAndUpdate({ confirmCode, status: 'PENDING CONFIRMATION' }, 'confirmCode', async (err, user) => {
    if (user == null) {
      throw new Error("NOPE");
    }
    user.status = 'ACTIVE'
    await user.save(err => {
      if (err) {
        throw new Error("ALMOST");
      }
      res.status(200).redirect('http://localhost:3000/home')
    })
  })
})

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
