import React from "react";
import Burger from "../Burger/Burger";
import Menu from "../Menu/Menu";
import "./NavBar.scss";

const NavBar = ({ title }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <nav className="navbar">
      <div className="container">
        <Burger open={open} setOpen={setOpen} />
        <Menu open={open} setOpen={setOpen} />
        <p>{title}</p>
      </div>
    </nav>
  );
};

export default NavBar;
