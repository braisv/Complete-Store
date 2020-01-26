import React from "react";
import { Link } from "react-router-dom";
import Signup from "../Auth/Signup";
import Login from "../Auth/Login";
import "./User.scss";

const User = () => {
  return (
    <div>
      <div className="user-options flex">
        <div className="user-option">
          <Link className="link" to="/user/signup">
            New here
          </Link>
        </div>
        <div className="user-option">
          <Link className="link" to="/user/login">
            Already user
          </Link>
        </div>
      </div>
    </div>
  );
};

export default User;
