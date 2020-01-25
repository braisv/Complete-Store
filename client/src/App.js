import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import logo from "./logo.svg";
import Signup from "./Components/Auth/Signup";
import Login from "./Components/Auth/Login";
import AuthService from "./utils/AuthService";
import "./App.css";
import NavBar from "./Components/NavBar/NavBar";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedInUser: null };
    this.service = new AuthService();
    this.fetchUser();
  }

  getUser = userObj => {
    this.setState({
      loggedInUser: userObj
    });
  };

  logout = () => {
    this.service
      .logout()
      .then(() => {
        this.setState({ loggedInUser: null });
      })
      .catch(err => console.log(err));
  };

  fetchUser() {
    return this.service
      .loggedin()
      .then(response => {
        this.setState({
          loggedInUser: response
        });
      })
      .catch(err => {
        this.setState({
          loggedInUser: false
        });
      });
  }

  render() {
    return (
      <div className="App">
        <NavBar title="Complete Store." />
      </div>
    );
  }
}
