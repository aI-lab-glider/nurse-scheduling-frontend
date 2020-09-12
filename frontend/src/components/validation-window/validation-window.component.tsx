import React from "react";

import Alert from "@material-ui/lab/Alert";

export function ValidationWindowComponent() {
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
