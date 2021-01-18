/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React, { ChangeEvent, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScheduleError } from "../../../common-models/schedule-error.model";
import { ScheduleExportLogic } from "../../../logic/schedule-exporter/schedule-export.logic";
import { ActionModel } from "../../../state/models/action.model";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ScheduleDataActionCreator } from "../../../state/reducers/month-state/schedule-data/schedule-data.action-creator";
import { ScheduleErrorActionType } from "../../../state/reducers/month-state/schedule-errors.reducer";
import {
  ButtonData,
  DropdownButtons,
} from "../../common-components/dropdown-buttons/dropdown-buttons.component";
import { useScheduleConverter } from "./hooks/use-schedule-converter";
import ParseErrorModal from "../../common-components/modal/error-modal/errors.modal.component";
import { cropScheduleDMToMonthDM } from "../../../common-models/schedule-data.model";

export function ImportButtonsComponent(): JSX.Element {
  const DEFAULT_FILENAME = "grafik.xlsx";
  const { scheduleModel, setSrcFile, scheduleErrors, errorOccurred } = useScheduleConverter();
  const fileUpload = useRef<HTMLInputElement>(null);

  const stateScheduleModel = useSelector(
    (state: ApplicationStateModel) => state.actualState.temporarySchedule?.present
  );
  const scheduleDipatcher = useDispatch();

  const btnData1: ButtonData = {
    label: "Wczytaj",
    action: () => fileUpload.current?.click(),
    dataCy: "load-schedule-button",
  };
  const btnData2: ButtonData = {
    label: "Zapisz jako...",
    action: (): void => handleExport(),
    dataCy: "export-schedule-button",
  };

  const btnData = [btnData1, btnData2];
  useEffect(() => {
    if (scheduleModel) {
      const action = ScheduleDataActionCreator.setScheduleFromMonthDM(
        cropScheduleDMToMonthDM(scheduleModel)
      );
      scheduleDipatcher(action);
    } else if (scheduleErrors) {
      setOpen(true);
    }

    scheduleDipatcher({
      type: ScheduleErrorActionType.UPDATE,
      payload: scheduleErrors,
    } as ActionModel<ScheduleError[]>);
  }, [scheduleModel, scheduleDipatcher, scheduleErrors, errorOccurred]);

  function handleImport(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target?.files && event.target?.files[0];
    if (file) {
      setSrcFile(file);
    }
  }

  function handleExport(): void {
    if (stateScheduleModel) {
      new ScheduleExportLogic(stateScheduleModel).formatAndSave(DEFAULT_FILENAME);
    }
  }

  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <DropdownButtons
        buttons={btnData}
        mainLabel="Plik"
        variant="primary"
        dataCy={"file-dropdown"}
      />
      <input
        ref={fileUpload}
        id="file-input"
        data-cy="file-input"
        onChange={(event): void => handleImport(event)}
        style={{ display: "none" }}
        type="file"
        accept=".xlsx"
      />

      {scheduleErrors.length !== 0 && <ParseErrorModal open={open} setOpen={setOpen} />}
    </div>
  );
}
