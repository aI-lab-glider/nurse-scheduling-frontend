/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { ChangeEvent, useEffect, useMemo } from "react";
import { ScheduleError } from "../../../../common-models/schedule-error.model";
import ParseErrorModal from "../../../common-components/modal/error-modal/errors.modal.component";
import { ScheduleDataActionCreator } from "../../../../state/reducers/month-state/schedule-data/schedule-data.action-creator";
import { ScheduleErrorActionType } from "../../../../state/reducers/month-state/schedule-errors.reducer";
import { ActionModel } from "../../../../state/models/action.model";
import { useDispatch } from "react-redux";
import { useScheduleConverter } from "./use-schedule-converter";

export interface UseScheduleImporterOptions {
  handleImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ParseErrorModal: JSX.Element | undefined;
}

export function useScheduleImporter(): UseScheduleImporterOptions {
  const [open, setParserModalOpen] = React.useState(false);
  const scheduleDipatcher = useDispatch();
  const { monthModel, setSrcFile, scheduleErrors } = useScheduleConverter();

  useEffect(() => {
    if (monthModel) {
      const action = ScheduleDataActionCreator.setScheduleFromMonthDMAndSaveInDB(monthModel);
      scheduleDipatcher(action);
    }
    if (scheduleErrors) {
      setParserModalOpen(true);
    }

    scheduleDipatcher({
      type: ScheduleErrorActionType.UPDATE,
      payload: scheduleErrors,
    } as ActionModel<ScheduleError[]>);
  }, [monthModel, scheduleDipatcher, scheduleErrors]);

  const parserErrorModal = useMemo(() => {
    if (scheduleErrors.length > 0) {
      return <ParseErrorModal open={open} setOpen={setParserModalOpen} />;
    }
  }, [open, setParserModalOpen, scheduleErrors]);

  function handleImport(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target?.files && event.target?.files[0];
    if (file) {
      setSrcFile(file);
    }
  }

  return {
    handleImport,
    ParseErrorModal: parserErrorModal,
  };
}
