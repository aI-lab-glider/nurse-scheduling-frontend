import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Popper from "@material-ui/core/Popper";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import XLSX from "xlsx";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useScheduleConverter } from "../../../hooks/file-processing/useScheduleConverter";
import { ActionModel } from "../../../state/models/action.model";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ScheduleDataModel } from "../../../state/models/schedule-data/schedule-data.model";
import { ScheduleErrorModel } from "../../../state/models/schedule-data/schedule-error.model";
import { ScheduleDataActionType } from "../../../state/reducers/schedule-data.reducer";
import { ScheduleErrorActionType } from "../../../state/reducers/schedule-errors.reducer";

export function ImportButtonsComponent() {
  //#region members
  const [open, setOpen] = useState(false);
  const { scheduleModel, setSrcFile, scheduleErrors } = useScheduleConverter();
  const anchorRef = useRef(null);
  const stateScheduleModel = useSelector((state: ApplicationStateModel) => state.scheduleData);

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
    if (stateScheduleModel) {
      writeScheduleToFile(stateScheduleModel);
    }
  };

  function writeScheduleToFile(scheduleModel: ScheduleDataModel) {
    let titleSection = ["GRAFIK", "MIESIĄC " + scheduleModel?.schedule_info?.month_number];
    let daysSection = ["Dni miesiąca", ...scheduleModel?.month_info?.dates!];
    let emptyRow = Array<null>(daysSection.length);
    let childrenSection = [
      "Liczba dzieci zarejestrowanych",
      ...scheduleModel?.month_info?.children_number!,
    ];

    let shiftSection = Array<Array<any>>();
    for (let worker in scheduleModel?.shifts) {
      // add empty row between different worker type shifts
      if (
        worker.match(/[O|o]piekunka/) &&
        shiftSection[shiftSection.length - 1][0].match(/[P|p]iel[ę|e]gniarka/)
      ) {
        shiftSection.push(emptyRow);
      }
      let shifts = scheduleModel.shifts[worker];
      let shiftRow = [worker, ...shifts, 1, 1, 1];
      shiftSection.push(shiftRow);
    }

    let scheduleArray = [
      titleSection,
      daysSection,
      emptyRow,
      childrenSection,
      emptyRow,
      ...shiftSection,
    ];

    let worksheet = XLSX.utils.aoa_to_sheet(scheduleArray);
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Grafik");
    XLSX.writeFile(workbook, "grafik.xlsx", { bookType: "xlsx" });
  }

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
