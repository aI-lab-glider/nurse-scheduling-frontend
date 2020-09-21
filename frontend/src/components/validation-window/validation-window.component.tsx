import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { ApplicationStateModel } from "../../state/models/application-state.model";
import { ScheduleErrorMessageModel } from "../../state/models/schedule-data/schedule-error-message.model";

export function ValidationWindowComponent() {
  //#region members
  const [errors, setErrors] = useState<ScheduleErrorMessageModel[]>();
  const [open, setOpen] = useState<boolean>(false);
  //#endregion

  //#region state interaction
  const errorsReceived = useSelector((state: ApplicationStateModel) => state.scheduleErrors);

  useEffect(() => {
    if (errorsReceived?.length) {
      setErrors(errorsReceived);
      setOpen(true);
    }
  }, [errorsReceived]);
  //#endregion

  //#region handlers
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setOpen(open);
  };
  //#endregion

  //#region view
  return (
    <Drawer open={open} onClose={toggleDrawer(false)} anchor={"right"}>
      <List>
        {errors?.map((error, index) => (
          <ListItem key={index + error.message.slice(0, 5)}>
            <ListItemIcon>
              <ErrorOutlineIcon />
            </ListItemIcon>
            <ListItemText primary={error.message} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
  //#endregion
}
