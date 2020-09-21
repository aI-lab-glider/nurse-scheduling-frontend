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
  const errors_received = useSelector((state: ApplicationStateModel) => state.scheduleErrors);

  useEffect(() => {
    if (errors_received?.length) {
      setErrors(errors_received);
      setOpen(true);
    }
  }, [errors_received]);
  //#endregion

  //#region handlers

  //#endregion

  //#region view
  return (
    <Drawer open={open} anchor={"right"}>
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
