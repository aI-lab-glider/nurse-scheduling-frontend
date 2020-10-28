import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Popper from "@material-ui/core/Popper";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useScheduleConverter } from "../../../hooks/file-processing/use-schedule-converter";
import { ActionModel } from "../../../state/models/action.model";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ScheduleErrorModel } from "../../../common-models/schedule-error.model";
import { ScheduleDataActionType } from "../../../state/reducers/schedule-data.reducer";
import { ScheduleErrorActionType } from "../../../state/reducers/schedule-errors.reducer";
import { ExportFormatter } from "../../../helpers/export/export-formatter";

export function ImportButtonsComponent(): JSX.Element {
  const [open, setOpen] = useState(false);
  const { scheduleModel, setSrcFile, scheduleErrors } = useScheduleConverter();
  const anchorRef = useRef(null);
  const stateScheduleModel = useSelector((state: ApplicationStateModel) => state.scheduleData);

  const scheduleDipatcher = useDispatch();

  useEffect(() => {
    if (scheduleModel) {
      scheduleDipatcher({
        type: ScheduleDataActionType.ADD_NEW,
        payload: scheduleModel,
      } as ActionModel<ScheduleDataModel>);
      scheduleDipatcher({
        type: ScheduleErrorActionType.UPDATE,
        payload: scheduleErrors,
      } as ActionModel<ScheduleErrorModel[]>);
    }
  }, [scheduleModel, scheduleDipatcher, scheduleErrors]);

  function handleImport(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target?.files && event.target?.files[0];
    if (file) {
      setSrcFile(file);
    }
  }

  function handleExport(): void {
    if (stateScheduleModel) {
      new ExportFormatter(stateScheduleModel).formatAndSave();
    }
  }

  function handleToggle(): void {
    setOpen((prevVal) => !prevVal);
  }

  return (
    <div>
      <Button onClick={handleToggle} ref={anchorRef}>
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
            <Button component="label">
              Wczytaj
              <input
                onChange={(event): void => handleImport(event)}
                style={{ display: "none" }}
                type="file"
              />
            </Button>

            <Button onClick={(): void => handleExport()}>Zapisz jako...</Button>
          </ButtonGroup>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}
