import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import logo from "./logo.svg";
import Signup from "./Components/Auth/Signup";
import Login from "./Components/Auth/Login";
import AuthService from "./utils/AuthService";
import "./App.css";

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
    if (this.state.loggedInUser) {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>Frontend of Complete Store</p>
            <div className="user-menu">
                <ul className='flex-column'>
                  <li>
                    <a className='link' href='/' onClick={this.logout}>Logout</a>
                  </li>
                </ul>
              </div>
          </header>
        </div>
      );
    } else {
      return (
        <React.Fragment>
          <div className="App flex">
            <header className="App-header">
              <Signup getUser={this.getUser}/>
              <Login />
              <Switch>
                <Route
                  exact
                  path="/signup"
                  render={() => <Signup getUser={this.getUser} />}
                />
                <Route
                  exact
                  path="/login"
                  render={() => <Login getUser={this.getUser} />}
                />
                {/* <Route exact path="/test" component={Appoteosis} /> */}
              </Switch>
            </header>
          </div>
        </React.Fragment>
      );
    }
  }
}
