/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { createStyles, Grid, Theme } from "@material-ui/core";
import * as S from "./styled";
import React, { ReactNode } from "react";
import { ReactComponent as Done } from "../../assets/images/done.svg";
import ScssVars from "../../assets/styles/styles/custom/_variables.module.scss";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    alertContainer: {
      height: ScssVars.alertHeight,
      borderRadius: ScssVars.alertHeight,
      backgroundColor: ScssVars.secondary,
      opacity: 0.8,
      padding: "15px 22px",
      textAlign: "center",
    },
    shadowContainer: {
      height: ScssVars.alertHeight,
      borderRadius: ScssVars.alertHeight,
      backgroundColor: ScssVars.white,
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
    },
    doneIcon: {
      marginRight: 9,
    },
    text: {
      fontSize: ScssVars.fontSizeBase,
      letterSpacing: 0.75,
      color: ScssVars.white,
    },
  })
);

interface AlertOptions {
  severity: string;
  children: ReactNode;
}
export function Alert({ severity, children }: AlertOptions): JSX.Element {
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
