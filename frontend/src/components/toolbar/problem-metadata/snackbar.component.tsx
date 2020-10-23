import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

function Alert(props: AlertProps): JSX.Element {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function SnackbarComponent({ alertMessage, open, setOpen }): JSX.Element {
  function handleClose(event?: React.SyntheticEvent, reason?: string): void {
    if (reason === "clickaway") return;

    setOpen(false);
  }

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="warning">
        {alertMessage}
      </Alert>
    </Snackbar>
  );
}
