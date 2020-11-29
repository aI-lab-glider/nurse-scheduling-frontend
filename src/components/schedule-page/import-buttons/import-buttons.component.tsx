import ButtonGroup from "@material-ui/core/ButtonGroup";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Popper from "@material-ui/core/Popper";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useScheduleConverter } from "./hooks/use-schedule-converter";
import { ActionModel } from "../../../state/models/action.model";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ScheduleError } from "../../../common-models/schedule-error.model";
import { ScheduleDataActionType } from "../../../state/reducers/schedule-data.reducer";
import { ScheduleErrorActionType } from "../../../state/reducers/schedule-errors.reducer";
import { ScheduleExportLogic } from "../../../logic/schedule-exporter/schedule-export.logic";
import { Button } from "../../common-components";

export function ImportButtonsComponent(): JSX.Element {
  const DEFAULT_FILENAME = "grafik.xlsx";
  const [open, setOpen] = useState(false);
  const { scheduleModel, setSrcFile, scheduleErrors, errorOccurred } = useScheduleConverter();
  const anchorRef = useRef(null);
  const fileUpload = useRef<HTMLInputElement>(null);

  const stateScheduleModel = useSelector(
    (state: ApplicationStateModel) => state.scheduleData?.present
  );
  const scheduleDipatcher = useDispatch();

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

  function handleToggle(): void {
    setOpen((prevVal) => !prevVal);
  }

  return (
    <div>
      <Button variant="primary" onClick={handleToggle} ref={anchorRef}>
        Plik
        <ArrowDropDownIcon />
      </Button>
      <Popper open={open} anchorEl={anchorRef.current}>
        <ClickAwayListener
          onClickAway={(): void => {
            setOpen(false);
          }}
        >
          <ButtonGroup orientation="vertical">
            <Button onClick={() => fileUpload.current?.click()}>
              Wczytaj
              <input
                ref={fileUpload}
                id="file-input"
                data-cy="file-input"
                onChange={(event): void => handleImport(event)}
                style={{ display: "none" }}
                type="file"
                accept=".xlsx"
              />
            </Button>
            <Button onClick={(): void => handleExport()}>Zapisz jako...</Button>
          </ButtonGroup>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}
