import React from "react";
import { Link } from "react-router-dom";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";

export default function Header(): JSX.Element {
  return (
    <>
      <div id={"header"}>
        <AssignmentIndIcon id={"AssignmentIndIcon"} />

        <ul>
          <li className={"active"}>
            <Link to="/">Plan</Link>
          </li>

          <li>
            <Link to="/workers/">Zarządzanie</Link>
          </li>
        </ul>

        <div className={"filler"} />
      </div>
    </>
  );
}
