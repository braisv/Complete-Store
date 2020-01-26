import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import AuthService from "../../utils/AuthService";
import { Link } from "react-router-dom";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      name: "",
      surname: "",
      email: "",
      phone: ""
    };
    this.service = new AuthService();
  }

  handleFormSubmit = event => {
    event.preventDefault();
    const { username, password, name, surname, email, phone } = this.state;

    this.validateMail(email);
    this.validatePassword(password);

    this.service
      .signup(username, password, name, surname, email, phone)
      .then(response => {
        this.setState({
          username: "",
          password: "",
          name: "",
          surname: "",
          email: "",
          phone: ""
        });
        console.log("USER: ", response.user);
        this.props.getUser(response.user);
      })
      .catch(error => {
        console.log(error.message);
        this.setState({
          username: username,
          password: password,
          name: name,
          surname: surname,
          email: email,
          phone: phone
        });
      });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  validateMail = mail => {
    // eslint-disable-next-line
    let mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (mail.match(mailFormat)) {
      return;
    }

    this.setState({
      ...this.state,
      invalidMail: "Use a valid mail"
    });
  };

  validatePassword = password => {
    let passFormat = /^(?=.*[0-9])(?=.*[a-zA-Z])\w{8,16}$/;

    if (password.match(passFormat)) {
      return;
    }

    this.setState({
      ...this.state,
      invalidPassword:
        "The password must contain from 8 to 16 characters and at least 1 digit and character"
    });
  };

  render() {
    return (
      <div className="user-container">
        <div className="user-options">
          <div className="flex">
          <div className="user-option selected">
            <Link className="link" to="/signup">
              New here
            </Link>
          </div>
          <div className="user-option">
            <Link className="link" to="/login">
              Already user
            </Link>
            </div>
          </div>
        </div>

        <div className="user-login flex-column">
        <h3>Sign up using your email adress</h3>

        <form className="signup-form" onSubmit={this.handleFormSubmit}>
          <div className="flex-column">
            <fieldset>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                placeholder="userN..."
                value={this.state.username}
                onChange={e => this.handleChange(e)}
              />
            </fieldset>

            <fieldset>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                placeholder="John..."
                value={this.state.name}
                onChange={e => this.handleChange(e)}
              />
            </fieldset>

            <fieldset>
              <label>Surname:</label>
              <input
                type="text"
                name="surname"
                placeholder="Wick..."
                value={this.state.surname}
                onChange={e => this.handleChange(e)}
              />
            </fieldset>

            <fieldset>
              <label>E-mail:</label>
              <input
                type="text"
                name="email"
                placeholder="something@like.this..."
                value={this.state.email}
                onChange={e => this.handleChange(e)}
              />
            </fieldset>

            <p>{this.state.invalidMail ? `${this.state.invalidMail}` : ""}</p>

            <fieldset>
              <label>Phone Number:</label>
              <input
                type="text"
                name="phone"
                value={this.state.phone}
                placeholder="+34 333 911 199..."
                onChange={e => this.handleChange(e)}
              />
            </fieldset>

            <fieldset>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                placeholder="********"
                value={this.state.password}
                onChange={e => this.handleChange(e)}
              />
            </fieldset>

            <p>
              {this.state.invalidPassword
                ? `${this.state.invalidPassword}`
                : ""}
            </p>
          </div>

          <input className="submit-signup" type="submit" value="Sign up" />
        </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Signup);
