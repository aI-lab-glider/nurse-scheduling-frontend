/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  Box,
  Divider,
  Drawer as MaterialDrawer,
  DrawerProps,
  Grid,
  IconButton,
} from "@material-ui/core";
import { MdClose } from "react-icons/md";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";
import classNames from "classnames";

const useStyles = makeStyles({
  drawer: {
    minWidth: 500,
  },
  drawerContentMargin: {
    paddingTop: 25,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 15,
  },
  fullHeight: {
    height: "100%",
  },
  exitButton: {
    margin: "-7px -8px",
    marginTop: -15,
    color: ScssVars.primary,
  },
  title: {
    fontFamily: ScssVars.fontFamilyPrimary,
    fontWeight: 700,
    fontSize: 18,
    lineHeight: 1.1,
    color: ScssVars.primary,
  },
});

export interface DrawerOptions extends DrawerProps {
  title: string;
  setOpen: (open: boolean) => void;
}

export default function Drawer(options: DrawerOptions): JSX.Element {
  const classes = useStyles();
  const { title, setOpen, children, ...otherOptions } = options;

  return (
    <MaterialDrawer classes={{ paper: classes.drawer }} {...otherOptions} anchor={"right"}>
      <Grid
        container
        className={classes.drawerContentMargin}
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <h1 className={classes.title}>{title}</h1>
        </Grid>
        <Grid item>
          <IconButton
            className={classes.exitButton}
            data-cy="exit-drawer"
            onClick={(): void => setOpen(false)}
          >
            <MdClose />
          </IconButton>
        </Grid>
      </Grid>

      <Divider />

      <Box className={classNames(classes.drawerContentMargin, classes.fullHeight)}>{children}</Box>
    </MaterialDrawer>
  );
}
