/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Drawer as MaterialDrawer, DrawerProps } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import DrawerHeader from "./drawer-header.component";
import { headerHeight } from "../../../assets/colors";

const useStyles = makeStyles({
  drawer: {
    marginTop: headerHeight,
    minWidth: 500,
    overflow: "hidden",
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
    <MaterialDrawer classes={{ paper: classes.drawer }} {...otherOptions} anchor="right">
      <DrawerHeader title={title} setOpen={setOpen}>
        {children}
      </DrawerHeader>
    </MaterialDrawer>
  );
}
