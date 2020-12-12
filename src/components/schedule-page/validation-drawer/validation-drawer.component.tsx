import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import {
  ScheduleErrorLevel,
  ScheduleErrorMessageModel,
} from "../../../common-models/schedule-error-message.model";
import { SpanErrors } from "./span-errors.component";

export default function ValidationDrawerComponent(): JSX.Element {
  const [mappedErrors, setMappedErrors] = useState<ScheduleErrorMessageModel[]>();
  const [open, setOpen] = useState<boolean>(false);
  const { scheduleErrors } = useSelector((state: ApplicationStateModel) => state);

  useEffect(() => {
    const noErrorsFound = [
      { kind: "", message: "Nie znaleziono błędów", level: ScheduleErrorLevel.INFO },
    ];
    if (scheduleErrors?.length) {
      setMappedErrors(scheduleErrors);
      setOpen(true);
    } else {
      setMappedErrors(noErrorsFound);
    }
  }, [scheduleErrors]);

  function toggleDrawer(open: boolean): void {
    setOpen(open);
  }

  return (
    <div>
      <Drawer open={open} onClose={(): void => toggleDrawer(false)} anchor={"right"}>
        <SpanErrors errors={mappedErrors} />
        <List>
          {mappedErrors?.map(
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
