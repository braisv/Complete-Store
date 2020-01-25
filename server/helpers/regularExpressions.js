module.exports = function() {
  this.validateMail = function(mail) {
    let mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (mail.match(mailFormat)) {
      return true;
    }
    console.log("You have entered an invalid email address!");
    return false;
  },
  this.validatePassword = function(password) {
    let passFormat = /^(?=.*[0-9])(?=.*[a-zA-Z])\w{8,16}$/;
    if (password.match(passFormat)) {
      return true;
    }
    console.log("You have entered an invalid password!");
    return false;
  };
};



