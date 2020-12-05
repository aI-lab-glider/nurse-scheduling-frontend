import React, { ChangeEvent, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useScheduleConverter } from "./hooks/use-schedule-converter";
import { ActionModel } from "../../../state/models/action.model";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ScheduleError } from "../../../common-models/schedule-error.model";
import { ScheduleDataActionType } from "../../../state/reducers/schedule-data.reducer";
import { ScheduleErrorActionType } from "../../../state/reducers/schedule-errors.reducer";
import { ScheduleExportLogic } from "../../../logic/schedule-exporter/schedule-export.logic";
import DropdownButtonsComponent from "../../common-components/dropdown-buttons/dropdown-buttons.component";
import { ButtonData } from "../../common-components/dropdown-buttons/dropdown-buttons.component";

export function ImportButtonsComponent(): JSX.Element {
  const DEFAULT_FILENAME = "grafik.xlsx";
  const { scheduleModel, setSrcFile, scheduleErrors, errorOccurred } = useScheduleConverter();
  const fileUpload = useRef<HTMLInputElement>(null);

  const stateScheduleModel = useSelector(
    (state: ApplicationStateModel) => state.scheduleData?.present
  );
  const scheduleDipatcher = useDispatch();

  const btnData1: ButtonData = { label: "Wczytaj", action: () => fileUpload.current?.click() };
  const btnData2: ButtonData = { label: "Zapisz jako...", action: (): void => handleExport() };

  const btnData = [btnData1, btnData2];

  useEffect(() => {
    if (scheduleModel) {
      scheduleDipatcher({
        type: ScheduleDataActionType.ADD_NEW,
        payload: scheduleModel,
      } as ActionModel<ScheduleDataModel>);
    } else if (errorOccurred) {
      //todo display message
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

  return (
    <div>
      <DropdownButtonsComponent buttons={btnData} mainLabel="Plik"></DropdownButtonsComponent>
      <input
        ref={fileUpload}
        id="file-input"
        data-cy="file-input"
        onChange={(event): void => handleImport(event)}
        style={{ display: "none" }}
        type="file"
        accept=".xlsx"
      />
    </div>
  );
}
