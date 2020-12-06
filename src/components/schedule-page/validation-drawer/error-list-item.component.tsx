import React from "react";
import { Button } from "../../common-components";

export default function ErrorListItem(): JSX.Element {
  return (
    <div className="error-list-item">
      <div className="red-rectangle"></div>
      <span className="error-date">10 października</span>
      <span className="error-text">Riley meows in the middle of the night</span>
      <Button variant="primary" style={{ transform: "scale(0.8)", float: "right" }}>
        Pokaż
      </Button>
    </div>
  );
}
