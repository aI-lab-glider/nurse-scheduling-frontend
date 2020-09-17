import Alert from "@material-ui/lab/Alert";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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

  return (
  <div className="content-box">
    {errors?.map((error, index) => 
      <Alert key={index + error.message.slice(0, 5)} variant="outlined" severity="warning">
        {error.message}
      </Alert>
    )}
  </div>)
  //#endregion
}
