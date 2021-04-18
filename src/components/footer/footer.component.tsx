/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ScssVars from "../../assets/styles/styles/custom/_variables.module.scss";
import gliderLogo from "../../assets/images/gliderLogo.png";
import { getLatestAppVersion } from "../../api/latest-github-version";
import { t } from "../../helpers/translations.helper";

const useStyles = makeStyles({
  footer: {
    background: ScssVars.white,
    padding: 10,
    borderTop: "1px solid #E9EEF9",
    color: ScssVars.primary,
    height: ScssVars.footerHeight,
    marginTop: 40,
  },
  logo: {
    height: 46,
    margin: "0px 10px",
  },
});

export function Footer(): JSX.Element {
  const classes = useStyles();
  const [latestVersion, setLatestVersion] = useState("");
  useEffect(() => {
    const awaitVersion = async (): Promise<void> => {
      const version = await getLatestAppVersion;
      setLatestVersion(version);
    };
    awaitVersion();
  }, []);

  return (
    <Grid container className={classes.footer} justify="space-between" alignItems="center">
      <Grid item>{latestVersion && `${t("version")}: ${latestVersion}`}</Grid>
      <Grid item>
        {t("realization")}
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
