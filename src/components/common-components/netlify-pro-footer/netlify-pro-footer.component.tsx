/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";
import gliderLogo from "../../../assets/images/gliderLogo.png";

const useStyles = makeStyles({
  footer: {
    background: ScssVars.white,
    padding: 10,
    borderTop: "1px solid #E9EEF9",
    color: ScssVars.primary,
    height: ScssVars.footerHeight,
  },
  logo: {
    height: 46,
    margin: "0px 10px",
  },
});

export function NetlifyProFooter(): JSX.Element {
  const classes = useStyles();

  return (
    <Grid container className={classes.footer} justify="space-between" alignItems="center">
      <Grid item>{`Wersja: ${process.env.REACT_APP_VERSION}`}</Grid>
      <Grid item>
        Wszelkie prawa zastrzeżone. Copyright © 2020-2021:
        <a href="http://www.glider.agh.edu.pl/" target="_blank" rel="noopener noreferrer">
          <img className={classes.logo} src={gliderLogo} alt="Logo koła naukowego Glider" />
          Glider
        </a>
      </Grid>
      <Grid item>
        <a href="https://www.netlify.com">
          <img
            src="https://www.netlify.com/img/global/badges/netlify-light.svg"
            alt="Deploys by Netlify"
          />
        </a>
      </Grid>
    </Grid>
  );
}
