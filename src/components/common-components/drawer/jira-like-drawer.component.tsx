/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import DrawerHeader from "./drawer-header.component";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useJiraLikeDrawer } from "./jira-like-drawer-context";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";

const useStyles = makeStyles({
  drawer: {
    minWidth: 690,
    height: `calc(100vh - ${
      parseInt(ScssVars.headerHeight.slice(0, -2)) +
      parseInt(ScssVars.drawerHeaderHeight.slice(0, -2)) +
      parseInt(ScssVars.footerHeight.slice(0, -2)) +
      1
    }px)`,
  },
});

export default function JiraLikeDrawer(): JSX.Element {
  const classes = useStyles();
  const { title, open, setOpen, childrenComponent } = useJiraLikeDrawer();

  return (
    <Box>
      {title && open && setOpen && childrenComponent && (
        <Box className={classes.drawer}>
          <DrawerHeader title={title} setOpen={setOpen}>
            {childrenComponent}
          </DrawerHeader>
        </Box>
      )}
    </Box>
  );
}
