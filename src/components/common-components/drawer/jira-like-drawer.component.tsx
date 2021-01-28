/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import DrawerContent from "./drawer-content.component";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useJiraLikeDrawer } from "./jira-like-drawer-context";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";

const useStyles = makeStyles({
  drawer: {
    minWidth: 600,
    overflow: "hidden",
    background: ScssVars.white,
    height: "100vh",
    boxShadow: "-10px 0px 20px rgb(0,0,0,0.3)",
  },
});

export default function JiraLikeDrawer(): JSX.Element {
  const classes = useStyles();
  const { title, open, setOpen, childrenComponent } = useJiraLikeDrawer();

  return (
    <Box>
      {title && open && setOpen && childrenComponent && (
        <Box className={classes.drawer}>
          <DrawerContent title={title} setOpen={setOpen}>
            {childrenComponent}
          </DrawerContent>
        </Box>
      )}
    </Box>
  );
}
