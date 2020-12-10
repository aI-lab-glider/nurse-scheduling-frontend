import { Drawer } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import {
  ScheduleErrorLevel,
  ScheduleErrorMessageModel,
} from "../../../common-models/schedule-error-message.model";
import { Button } from "../../common-components";
import { SpanErrors } from "./span-errors.component";
import ErrorListItem from "./error-list-item.component";

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

  function toggleDrawer(open: boolean): void {
    setOpen(open);
  }

  return (
    <div>
      <Button variant="outlined" onClick={(): void => toggleDrawer(true)}>
        Pokaż błędy
      </Button>
      <Drawer open={open} onClose={(): void => toggleDrawer(false)} anchor={"right"}>
        <SpanErrors errors={errors} />
        {errors?.map(
          (error): JSX.Element => (
            <ErrorListItem error={error} />
          )
        )}
      </Drawer>
    </div>
  );
}
