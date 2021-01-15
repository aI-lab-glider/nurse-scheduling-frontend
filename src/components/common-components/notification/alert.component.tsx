import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { createStyles, Grid, Theme } from "@material-ui/core";
import { ReactComponent as Done } from "../../../assets/images/done.svg";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    alertContainer: {
      borderRadius: 52,
      backgroundColor: "#000",
      opacity: 0.8,
      height: 52,
      padding: "15px 22px",
      textAlign: "center",
    },
    shadowContainer: {
      height: 52,
      borderRadius: 52,
      backgroundColor: "#FFF",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
    },
    doneIcon: {
      marginRight: 9,
    },
    text: {
      fontSize: 16,
      letterSpacing: 0.75,
      color: "#fff",
    },
  })
);

export function Alert({ severity, children }): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.shadowContainer}>
      <Grid container className={classes.alertContainer}>
        <Grid item>{severity === "success" && <Done className={classes.doneIcon} />}</Grid>
        <Grid item className={classes.text}>
          {children}
        </Grid>
      </Grid>
    </div>
  );
}
