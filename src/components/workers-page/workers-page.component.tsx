import React from "react";
import { Link } from "react-router-dom";

export default function WorkersPage(): JSX.Element {
  return (
    <div>
      I am workers page, and I seem to work! <br />
      <Link to="/">Go to schedule page!</Link>
    </div>
  );
}
