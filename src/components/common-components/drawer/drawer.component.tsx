/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Drawer as MaterialDrawer, DrawerProps } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";
import DrawerHeader from "./drawer-header.component";

const useStyles = makeStyles({
  drawer: {
    minWidth: 500,
    overflow: "hidden",
  },
  drawerContentMargin: {
    paddingTop: 25,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 15,
  },
  fullHeight: {
    height: "100%",
    overflowY: "scroll",
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
      <DrawerHeader title={title} setOpen={setOpen}>
        {children}
      </DrawerHeader>
    </MaterialDrawer>
  );
}
