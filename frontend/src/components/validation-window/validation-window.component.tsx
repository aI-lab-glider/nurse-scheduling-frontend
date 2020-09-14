import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Alert from "@material-ui/lab/Alert";
import { ApplicationStateModel } from "../../state/models/application-state.model";

export function ValidationWindowComponent() {
  //#region members
  const [errors, setErrors] = useState();
  //#endregion

  //#region state interaction
  const errors_received = useSelector((state: ApplicationStateModel) => state.scheduleErrors);

  useEffect(() => {
    if (errors_received) {
      console.log("Got errors!");
      console.log(errors_received);
    }
  }, [errors_received]);

  //#endregion

  //#region view
  function error(message) {
    return <Alert severity="warning">{message}</Alert>;
  }

  return (
    <div>
      {error("Brakuje 3 pielęgniarek na zmianie dziennej dnia 17!")}
      {error("bleblepleple")}
    </div>
  );
  //#endregion
}
