import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Alert from "@material-ui/lab/Alert";
import { ApplicationStateModel } from "../../state/models/application-state.model";
import { ScheduleErrorMessageModel } from "../../state/models/schedule-data/schedule-error-message.model";

export function ValidationWindowComponent() {
  //#region members
  const [errors, setErrors] = useState<ScheduleErrorMessageModel[]>();
  //#endregion

  //#region state interaction
  const errors_received = useSelector((state: ApplicationStateModel) => state.scheduleErrors);

  useEffect(() => {
    if (errors_received) {
      setErrors(errors_received);
    }
  }, [errors_received]);

  //#endregion

  //#region view

  function alert(message) {
    return (
      <Alert variant="outlined" severity="warning">
        {message}
      </Alert>
    );
  }

  return <div>{errors?.map((r) => alert(r.message))}</div>;
  //#endregion
}
