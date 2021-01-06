/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import Drawer from "../../common-components/drawer/drawer.component";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import {
  ScheduleErrorLevel,
  ScheduleErrorMessageModel,
} from "../../../common-models/schedule-error-message.model";
import { SpanErrors } from "./span-errors.component";
import ErrorList from "./error-list.component";

export interface ValidationDrawerOptions {
  open: boolean;
  setOpen: (boolean) => void;
}

export default function ValidationDrawerComponent(options: ValidationDrawerOptions): JSX.Element {
  const { open, setOpen } = options;
  const [mappedErrors, setMappedErrors] = useState<ScheduleErrorMessageModel[]>();
  const { scheduleErrors } = useSelector((state: ApplicationStateModel) => state.actualState);

  useEffect(() => {
    const spinner = [
      {
        kind: "",
        title: "kółeczko",
        message: "Teraz kręci się kółeczko",
        level: ScheduleErrorLevel.INFO,
      },
    ];
    if (scheduleErrors?.length) {
      setMappedErrors(scheduleErrors);
      setOpen(true);
    } else {
      setMappedErrors(spinner);
    }
  }, [scheduleErrors, setOpen]);

  function closeDrawer(): void {
    setOpen(false);
  }

  return (
    <Drawer
      title="Sprawdź plan"
      setOpen={setOpen}
      open={open}
      onClose={(): void => closeDrawer()}
      anchor="right"
    >
      <SpanErrors errors={mappedErrors} />
      <ErrorList errors={mappedErrors} />
    </Drawer>
  );
}
