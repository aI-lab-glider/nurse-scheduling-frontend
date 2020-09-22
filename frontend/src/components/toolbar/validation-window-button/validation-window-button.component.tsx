import React, { useState, useEffect } from "react";
import { Button, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { ScheduleErrorMessageModel } from "../../../state/models/schedule-data/schedule-error-message.model";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { useSelector } from "react-redux";

export default function ValidationWindowButtonComponent() {
  //#region members
  const [errors, setErrors] = useState<ScheduleErrorMessageModel[]>();
  const [open, setOpen] = useState<boolean>(false);
  //#endregion

  //#region state interaction
  const errorsReceived = useSelector((state: ApplicationStateModel) => state.scheduleErrors);
  const noErrorsFound = [{ code: "", message: "Nie znaleziono błędów" }];

  useEffect(() => {
    if (errorsReceived?.length) {
      setErrors(errorsReceived);
    } else {
      setErrors(noErrorsFound);
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
    <div>
      <Button onClick={toggleDrawer(true)}>Pokaż błędy</Button>
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
    </div>
  );
  //#endregion
}
