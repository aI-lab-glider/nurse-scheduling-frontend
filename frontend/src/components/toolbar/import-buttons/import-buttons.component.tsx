import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Popper from "@material-ui/core/Popper";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useScheduleConverter } from "../../../hooks/file-processing/useScheduleConverter";
import { ActionModel } from "../../../state/models/action.model";
import { ScheduleDataModel } from "../../../state/models/schedule-data/schedule-data.model";
import { ScheduleErrorModel } from "../../../state/models/schedule-data/schedule-error.model";
import { ScheduleDataActionType } from "../../../state/reducers/schedule-data.reducer";
import { ScheduleErrorActionType } from "../../../state/reducers/schedule-errors.reducer";

export function ImportButtonsComponent() {
  //#region members
  const [open, setOpen] = useState(false);
  const { scheduleModel, setSrcFile, scheduleErrors } = useScheduleConverter();
  const anchorRef = useRef(null);

  //#endregion

  //#region effects
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
  //#endregion

  //#region logic
  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files && event.target?.files[0];
    if (file) {
      setSrcFile(file);
    }
  };

  const handleExport = () => {
    console.log("Export clicked");
  };

  const handleToggle = () => {
    setOpen((prevVal) => !prevVal);
  };
  //#endregion

  // #region view
  return (
    <div>
      <Button onClick={() => handleToggle()} ref={anchorRef}>
        Plik
        <ArrowDropDownIcon />
      </Button>
      <Popper open={open} anchorEl={anchorRef.current}>
        <ClickAwayListener
          onClickAway={() => {
            setOpen(false);
          }}
        >
          <ButtonGroup orientation="vertical">
            <Button component="label">
              Wczytaj
              <input
                onChange={(event) => handleImport(event)}
                style={{ display: "none" }}
                type="file"
              />
            </Button>

            <Button onClick={() => handleExport()}>Zapisz jako...</Button>
          </ButtonGroup>
        </ClickAwayListener>
      </Popper>
    </div>
  );
  // #endregion
}
