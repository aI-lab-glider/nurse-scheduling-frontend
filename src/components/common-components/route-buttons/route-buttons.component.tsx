import React from "react";
import { Link } from "react-router-dom";

export default function RouteButtonsComponent(): JSX.Element {
  return (
    <>
      <div id={"route-buttons"}>
        <ul>
          <li className={"active"}>
            <Link to="/">Plan</Link>
          </li>

          <li>
            <Link to="/workers/">Zarządzanie</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
