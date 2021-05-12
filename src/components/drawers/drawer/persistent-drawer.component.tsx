/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Box } from "@material-ui/core";
import * as S from "./styled";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";
import { ApplicationStateModel } from "../../../state/application-state.model";
import { ScheduleMode } from "../../schedule/schedule-state.model";
import DrawerHeader from "./drawer-header.component";
import { usePersistentDrawer } from "./persistent-drawer-context";

export interface StyleProps {
  width: number;
}

// TODO: add types declaration
const useStyles = makeStyles<Theme, StyleProps>({
  drawer: {
    width: ({ width }): number => width,
    height: `calc(100vh - ${
      parseInt(ScssVars.headerHeight!.slice(0, -2), 10) +
      parseInt(ScssVars.drawerHeaderHeight!.slice(0, -2), 10) +
      1
    }px)`,
  },
});

export default function PersistentDrawer(width: StyleProps): JSX.Element {
  const isEditMode = useSelector(
    (state: ApplicationStateModel) => state.actualState.mode === ScheduleMode.Edit
  );
  const classes = useStyles(width);
  const { title, open, setOpen, childrenComponent } = usePersistentDrawer();

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
