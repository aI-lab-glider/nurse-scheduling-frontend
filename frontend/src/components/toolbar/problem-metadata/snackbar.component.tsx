import React from "react";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

export function ValidationWindowComponent() {
  const [open, setOpen] = React.useState(false);

  return <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}></Snackbar>;
}
