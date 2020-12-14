import Drawer from "../../common-components/drawer/drawer.component";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ScheduleErrorMessageModel } from "../../../common-models/schedule-error-message.model";
import { SpanErrors } from "./span-errors.component";
import ErrorList from "./error-list.component";

export default function ValidationDrawerComponent(): JSX.Element {
  const [mappedErrors, setMappedErrors] = useState<ScheduleErrorMessageModel[]>();
  const [open, setOpen] = useState<boolean>(false);
  const { scheduleErrors } = useSelector((state: ApplicationStateModel) => state);

  useEffect(() => {
    if (scheduleErrors?.length) {
      setMappedErrors(scheduleErrors);
      setOpen(true);
    }
  }, [scheduleErrors]);

  function toggleDrawer(open: boolean): void {
    setOpen(open);
  }

  return (
    <div>
      <Drawer
        title="Sprawdź plan"
        setOpen={setOpen}
        open={open}
        onClose={(): void => toggleDrawer(false)}
        anchor={"right"}
      >
        <SpanErrors errors={mappedErrors} />
        <ErrorList errors={mappedErrors} />
      </Drawer>
    </div>
  );
}
