import React from "react";
import { Notification } from "./types";
import { Box, createStyles, Snackbar, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useNotification } from "./notification.context";
import { Alert } from "./alert.component";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      position: "fixed",
      bottom: 0,
    },
    snackbar: {
      position: "relative",
      margin: 25,
    },
    alert: {
      fontSize: 14,
    },
  })
);

export interface NotificationSnackbarOptions {
  notification: Notification;
}

export function NotificationSnackbar({ notification }: NotificationSnackbarOptions): JSX.Element {
  const classes = useStyles();
  const { type, message } = notification;

  return (
    <Snackbar className={classes.snackbar} open={true} autoHideDuration={8000}>
      <Alert severity={type}>{message}</Alert>
    </Snackbar>
  );
}

export function NotificationList(): JSX.Element {
  const classes = useStyles();
  const { notifications } = useNotification();

  if (!notifications.length) return <></>;

  return (
    <Box className={classes.list}>
      {notifications.map((notification) => (
        <Box key={notification.id}>
          <NotificationSnackbar notification={notification} />
        </Box>
      ))}
    </Box>
  );
}
