import React from "react";
import { Button } from "../../common-components";
import { ScheduleErrorMessageModel } from "../../../common-models/schedule-error-message.model";

interface Options {
  error: ScheduleErrorMessageModel;
}

export default function ErrorListItem({ error }: Options): JSX.Element {
  return (
    <div className="error-list-item">
      <div className="red-rectangle"></div>
      <div className="error-title">
        <p className="error-title-content">{error.title}</p>
      </div>
      <div className="error-text">{error.message}</div>
      <div className="error-btn">
        <Button variant="primary" id="error-buttons" style={{ width: "90px", height: "26px" }}>
          Pokaż
        </Button>
      </div>
    </div>
  );
}
