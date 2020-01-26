import React from "react";
import Burger from "../Burger/Burger";
import Menu from "../Menu/Menu";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import "./NavBar.scss";

const NavBar = ({ title }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <nav className="navbar">
      <div className="container">
        <Burger open={open} setOpen={setOpen} />
        <Menu open={open} setOpen={setOpen} />
        <p>{title}</p>
        <span className="icons">
          <FontAwesomeIcon icon={faSearch} size="3x" />
        </span>
        <Link className="link" to="/user">
          <FontAwesomeIcon icon={faUserCircle} size="3x" />
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
