/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../../state/models/application-state.model";
import { ScheduleErrorMessageModel } from "../../../../common-models/schedule-error-message.model";
import { Button } from "../..";
import DefaultModal from "../modal.component";
import ModalErrorList from "./error.modal.list.component";
import { ErrorMessageHelper } from "../../../../helpers/error-message.helper";
import { ScheduleError } from "../../../../common-models/schedule-error.model";

export interface ErrorsModalComponent {
  setOpen: (open: boolean) => void;
  open: boolean;
}

export default function ParseErrorModal(options: ErrorsModalComponent): JSX.Element {
  const { setOpen, open } = options;
  const { scheduleErrors } = useSelector((state: ApplicationStateModel) => state.actualState);

  const handleClose = (): void => {
    setOpen(false);
  };
  const [mappedErrors, setMappedErrors] = useState<ScheduleErrorMessageModel[]>();

  useEffect(() => {
    const errors = ErrorMessageHelper.mapScheduleErrors(scheduleErrors);
    if (errors) {
      setMappedErrors(errors);
    }
  }, [scheduleErrors]);

  const title = "Napotkano błędy podczas wczytywania pliku";

  const footer = (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Button onClick={handleClose} size="small" className="submit-button" variant="primary">
        OK
      </Button>
    </div>
  );

  const body = <ModalErrorList errors={mappedErrors} />;

  return (
    <div>
      <DefaultModal open={open} setOpen={setOpen} title={title} body={body} footer={footer} />
    </div>
  );
}
