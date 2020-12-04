import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ColorHelper } from "../../../helpers/colors/color.helper";
import { ErrorMessageHelper } from "../../../helpers/error-message.helper";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import {
  ScheduleErrorLevel,
  ScheduleErrorMessageModel,
} from "../../../common-models/schedule-error-message.model";
import { Button } from "../../common-components";

export default function ValidationDrawerComponent(): JSX.Element {
  const [errors, setErrors] = useState<ScheduleErrorMessageModel[]>();
  const [open, setOpen] = useState<boolean>(false);
  const errorsReceived = useSelector((state: ApplicationStateModel) => state.scheduleErrors);

  useEffect(() => {
    const noErrorsFound = [
      { kind: "", message: "Nie znaleziono błędów", level: ScheduleErrorLevel.INFO },
    ];
    if (errorsReceived?.length) {
      setErrors(errorsReceived);
    } else {
      setErrors(noErrorsFound);
    }
  }, [errorsReceived]);

  function errorLevelInErrors(errorLevel: ScheduleErrorLevel): boolean {
    return (errors && errors.filter((e) => e.level === errorLevel).length !== 0) ?? false;
  }

  function getColor(): string {
    if (errorLevelInErrors(ScheduleErrorLevel.CRITICAL_ERROR)) {
      return ErrorMessageHelper.getErrorColor(ScheduleErrorLevel.CRITICAL_ERROR).toString();
    }
    if (errorLevelInErrors(ScheduleErrorLevel.WARNING)) {
      return ErrorMessageHelper.getErrorColor(ScheduleErrorLevel.WARNING).toString();
    }
    return ColorHelper.getDefaultColor().toString();
  }

  function toggleDrawer(open: boolean): void {
    setOpen(open);
  }

  return (
    <div>
      <Button variant="outlined" onClick={(): void => toggleDrawer(true)}>
        Pokaż błędy
      </Button>
      <Drawer open={open} onClose={(): void => toggleDrawer(false)} anchor={"right"}>
        <List>
          {errors?.map(
            (error, index): JSX.Element => (
              <ListItem key={index + error.message.slice(0, 5)}>
                <ListItemIcon>
                  <ErrorOutlineIcon />
                </ListItemIcon>
                <ListItemText primary={error.message} />
              </ListItem>
            )
          )}
        </List>
      </Drawer>
    </div>
  );
}
