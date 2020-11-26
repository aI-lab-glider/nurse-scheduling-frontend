import React from "react";
import { Link } from "react-router-dom";

export default function Header(): JSX.Element {
  return (
    <>
      <div id={"header"}>
        <img src={require("../../../assets/images/header-logo.png")} title={""} alt={""} />

        <ul>
          <li className={"active"}>
            <Link to="/">Plan</Link>
          </li>

          <li>
            <Link to="/workers/">Zarządzanie</Link>
          </li>
        </ul>

        <div className={"filler"}></div>

        <ul>
          <li>
            <Link to="/">Imię i nazwisko</Link>
          </li>
        </ul>

        <Link to={"/"}>
          <img src={require("../../../assets/images/arrow.png")} title={""} alt={""} />
        </Link>
      </div>
    </>
  );
}
