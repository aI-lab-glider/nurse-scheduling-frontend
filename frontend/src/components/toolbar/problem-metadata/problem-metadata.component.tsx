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
import "./problem-metadata.css";
import { SnackbarComponent } from "./snackbar.component";

export function ProblemMetadataComponent() {
  //#region members

  const [selectedDate, handleDateChange] = useState<Date>(new Date());
  const [numberOfNurses, setNumberOfNurses] = useState<number>(0);
  const [numberOfSitters, setNumberOfSitters] = useState<number>(0);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  //#endregion

  //#region state interaction
  const schedule = useSelector((state: ApplicationStateModel) => state.scheduleData);

  const dispatcher = useDispatch();

  useEffect(() => {
    if (schedule) {
      let { year, month_number } = schedule.schedule_info || {};
      let { babysitterCount, nurseCount } = schedule.employee_info || {};

      if (month_number && year) {
        handleDateChange(MonthLogic.convertToDate(month_number, year));
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
  function showSnackbar(message) {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  }

  function handleNumberOfNursesChange() {
    let { nurseCount } = schedule?.employee_info || {};

    if (!nurseCount) {
      return;
    }

    if (nurseCount > numberOfNurses) {
      setNumberOfNurses(nurseCount);
      showSnackbar("Wprowadzono mniej pielęgniarek niż w harmonogramie");
    }
  }

  function handleNumberOfSittersChange() {
    let { babysitterCount } = schedule?.employee_info || {};

    if (!babysitterCount) {
      return;
    }

    if (babysitterCount > numberOfSitters) {
      setNumberOfSitters(babysitterCount);
      showSnackbar("Wprowadzono mniej opiekunek niż w harmonogramie");
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (schedule) {
      console.log(schedule);
      const response = await backend.getErrors(schedule!);
      dispatcher({
        type: ScheduleErrorActionType.UPDATE,
        payload: response,
      } as ActionModel<ScheduleErrorModel[]>);
    }
  };
  //#endregion

  //#region  view
  function textField(id, label, value, setFunction, onTextFieldBlur?) {
    return (
      <TextField
        required
        id={id}
        label={label}
        value={value}
        onChange={(e) => setFunction(e.target.value)}
        onBlur={onTextFieldBlur}
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

      {textField(
        "nurses",
        "Ilość pielęgniarek",
        numberOfNurses,
        setNumberOfNurses,
        handleNumberOfNursesChange
      )}
      {textField(
        "sitters",
        "Ilość opiekunek",
        numberOfSitters,
        setNumberOfSitters,
        handleNumberOfSittersChange
      )}
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
      <SnackbarComponent
        alertMessage={snackbarMessage}
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        key={snackbarMessage}
      />
    </form>
  );
  //#endregion
}
