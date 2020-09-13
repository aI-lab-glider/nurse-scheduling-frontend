import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import plLocale from "date-fns/locale/pl";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import backend from "../../../api/backend";
import { MonthLogic } from "../../../logic/schedule/month.logic";
import { ActionModel } from "../../../state/models/action.model";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ScheduleErrorModel } from "../../../state/models/schedule-data/schedule-error.model";
import { ScheduleErrorActionType } from "../../../state/reducers/schedule-errors.reducer";
import { SnackbarComponent } from "./snackbar.component";
import "./problem-metadata.css";

export function ProblemMetadataComponent() {
  //#region members

  const [selectedDate, handleDateChange] = useState<Date>(new Date());
  const [numberOfChildren, setNumberOfChildren] = useState<number>(0);
  const [numberOfNurses, setNumberOfNurses] = useState<number>(0);
  const [numberOfSitters, setNumberOfSitters] = useState<number>(0);
  const [openMissingWorkerSnackbar, setOpenMissingWorkerSnackbar] = useState<boolean>(false);
  const [openTooFewNursesSnackbar, setOpenTooFewNursesSnackbar] = useState<boolean>(false);
  const [openTooFewSittersSnackbar, setOpenTooFewSittersSnackbar] = useState<boolean>(false);
  //#endregion

  //#region state interaction
  const schedule = useSelector((state: ApplicationStateModel) => state.scheduleData);

  const dispatcher = useDispatch();

  useEffect(() => {
    if (schedule) {
      let monthNumber = schedule.schedule_info?.month_number;
      let year = schedule.schedule_info?.year;
      let nurseCount = schedule.employee_info?.nurseCount;
      let babysitterCount = schedule.employee_info?.babysitterCount;
      // children number in first day of month
      let childrenCount = schedule.month_info?.children_number[0];

      if (monthNumber && year) {
        handleDateChange(MonthLogic.convertToDate(monthNumber, year));
      }
      if (childrenCount) {
        setNumberOfChildren(childrenCount);
      }
      if (babysitterCount) {
        setNumberOfSitters(babysitterCount);
      }
      if (nurseCount) {
        setNumberOfNurses(nurseCount);
      }
    }
  }, [schedule]);
  //#endregion

  //#region handlers

  // TODO: toast the error messages instead of console logging
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!schedule?.employee_info?.nurseCount || !schedule?.employee_info?.babysitterCount) {
      setOpenMissingWorkerSnackbar(true);
      return;
    }

    let nurseCount = schedule.employee_info.nurseCount;
    let babysitterCount = schedule.employee_info.babysitterCount;

    if (nurseCount > numberOfNurses) {
      setNumberOfNurses(nurseCount);
      setOpenTooFewNursesSnackbar(true);
    }

    if (babysitterCount > numberOfSitters) {
      setNumberOfSitters(babysitterCount);
      setOpenTooFewSittersSnackbar(true);
    }

    console.log(schedule);
    const response = await backend.getErrors(schedule);
    dispatcher({
      type: ScheduleErrorActionType.UPDATE,
      payload: response,
    } as ActionModel<ScheduleErrorModel[]>);
  };
  //#endregion

  //#region  view
  function alertSnackbar(message, open, setOpen) {
    return <SnackbarComponent alertMessage={message} open={open} setOpen={setOpen} key={message} />;
  }

  function textField(id, label, value, setFunction) {
    return (
      <TextField
        required
        id={id}
        label={label}
        value={value}
        onChange={(e) => setFunction(e.target.value)}
      />
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit} autoComplete="off">
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={plLocale}>
        <DatePicker
          required
          variant="inline"
          openTo="year"
          views={["year", "month"]}
          label="Z miesiąca"
          value={selectedDate}
          onChange={(date) => {
            if (date) {
              handleDateChange(date);
            }
          }}
        />
      </MuiPickersUtilsProvider>

      {textField("children", "Ilość dzieci", numberOfChildren, setNumberOfChildren)}
      {textField("nurses", "Ilość pielęgniarek", numberOfNurses, setNumberOfNurses)}
      {textField("sitters", "Ilość opiekunek", numberOfSitters, setNumberOfSitters)}
      <br />
      <Button
        size="small"
        className="submit-button"
        type="submit"
        variant="contained"
        color="primary"
      >
        Poprawić
      </Button>
      {alertSnackbar(
        "Wczytany harmonogram nie zawiera ilości pielęgniarek lub opiekunek",
        openMissingWorkerSnackbar,
        setOpenMissingWorkerSnackbar
      )}
      {alertSnackbar(
        "Wprowadzono mniej pielęgniarek niż w harmonogramie",
        openTooFewNursesSnackbar,
        setOpenTooFewNursesSnackbar
      )}
      {alertSnackbar(
        "Wprowadzono mniej opiekunek niż w harmonogramie",
        openTooFewSittersSnackbar,
        setOpenTooFewSittersSnackbar
      )}
    </form>
  );
  //#endregion
}
