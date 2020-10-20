import { Button, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Colors } from "../../../helpers/colors/colors";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import {
  ScheduleErrorLevel,
  ScheduleErrorMessageModel,
} from "../../../state/models/schedule-data/schedule-error-message.model";

export default function ValidationDrawerComponent() {
  //#region members
  const [errors, setErrors] = useState<ScheduleErrorMessageModel[]>();
  const [open, setOpen] = useState<boolean>(false);
  //#endregion

  //#region state interaction
  const errorsReceived = useSelector((state: ApplicationStateModel) => state.scheduleErrors);

  useEffect(() => {
    const noErrorsFound = [
      { code: "", message: "Nie znaleziono błędów", level: ScheduleErrorLevel.INFO },
    ];
    if (errorsReceived?.length) {
      setErrors(errorsReceived);
    } else {
      setErrors(noErrorsFound);
    }
  }, [errorsReceived]);
  //#endregion

  function errorLevelInErrors(errorLevel: ScheduleErrorLevel) {
    return errors && errors.filter((e) => e.level === errorLevel).length !== 0;
  }

  function getColor(): string {
    if (errorLevelInErrors(ScheduleErrorLevel.CRITICAL_ERROR)) {
      return Colors.DARK_RED.fade(0.4).toString();
    }
    if (errorLevelInErrors(ScheduleErrorLevel.WARNING)) {
      return Colors.TUSCANY.fade(0.4).toString();
    }
    return Colors.WHITE.toString();
  }
  //#region handlers
  function toggleDrawer(open: boolean): void {
    setOpen(open);
  }
  //#endregion

  //#region view
  return (
    <div>
      <Button
        onClick={() => toggleDrawer(true)}
        style={{
          backgroundColor: getColor(),
        }}
      >
        Pokaż błędy
      </Button>
      <Drawer open={open} onClose={() => toggleDrawer(false)} anchor={"right"}>
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
