/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect } from "react";
import DrawerHeader from "./drawer-header.component";
import { Box } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useJiraLikeDrawer } from "./jira-like-drawer-context";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";

export interface StyleProps {
  width: number;
}

const useStyles = makeStyles<Theme, StyleProps>({
  drawer: {
    width: ({ width }): number => width,
    height: `calc(100vh - ${
      parseInt(ScssVars.headerHeight.slice(0, -2)) +
      parseInt(ScssVars.drawerHeaderHeight.slice(0, -2)) +
      parseInt(ScssVars.footerHeight.slice(0, -2)) +
      1
    }px)`,
  },
});

export default function JiraLikeDrawer(width): JSX.Element {
  const isEditMode = useSelector(
    (state: ApplicationStateModel) => state.actualState.mode === "edit"
  );
  const classes = useStyles(width);
  const { title, open, setOpen, childrenComponent } = useJiraLikeDrawer();

  useEffect(() => {
    if (!isEditMode) setOpen(false);
  }, [isEditMode, setOpen]);

  return (
    <Box>
      {title && open && setOpen && childrenComponent && isEditMode && (
        <Box className={classes.drawer}>
          <DrawerHeader title={title} setOpen={setOpen}>
            {childrenComponent}
          </DrawerHeader>
        </Box>
      )}
    </Box>
  );
}
