import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import plLocale from "date-fns/locale/pl";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import backend from "../../../api/backend";
import { MonthLogic } from "../../../logic/schedule/month.logic";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import "./problem-metadata.css";

export function ProblemMetadataComponent() {
  //#region members

  const [selectedDate, handleDateChange] = useState<Date>(new Date());
  const [numberOfChildren, setNumberOfChildren] = useState<number>(0);
  const [numberOfNurses, setNumberOfNurses] = useState<number>(0);
  const [numberOfSitters, setNumberOfSitters] = useState<number>(0);
  //#endregion

  //#region state interaction
  const schedule = useSelector((state: ApplicationStateModel) => state.scheduleData);

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
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (schedule) {
      console.log(schedule);
      const response = await backend.fixSchedule(schedule);
      console.log(response);
    }
  };
  //#endregion

  //#region  view
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
    </form>
  );
  //#endregion
}
