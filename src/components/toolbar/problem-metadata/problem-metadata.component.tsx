import DateFnsUtils from "@date-io/date-fns";
import { Box } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import plLocale from "date-fns/locale/pl";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import backend from "../../../api/backend";
import { MonthInfoLogic } from "../../../logic/schedule-logic/month-info.logic";
import { ActionModel } from "../../../state/models/action.model";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { WorkerType } from "../../../common-models/worker-info.model";
import { ScheduleDataModel } from "../../../common-models/schedule-data.model";
import { ScheduleError } from "../../../common-models/schedule-error.model";
import { ScheduleDataActionType } from "../../../state/reducers/schedule-data.reducer";
import { ScheduleErrorActionType } from "../../../state/reducers/schedule-errors.reducer";
import { SnackbarComponent } from "./snackbar.component";
import { ShiftHelper } from "../../../helpers/shifts.helper";

function getWorkersCount(scheduleModel: ScheduleDataModel): number[] {
  const {
    [WorkerType.NURSE]: nurseShifts,
    [WorkerType.OTHER]: babysitterShifts,
  } = ShiftHelper.groupShiftsByWorkerType(
    scheduleModel.shifts || {},
    scheduleModel.employee_info?.type || {}
  );

  return [Object.keys(babysitterShifts).length, Object.keys(nurseShifts).length];
}

export function ProblemMetadataComponent(): JSX.Element {
  const [selectedDate, handleDateChange] = useState<Date>(new Date());
  const [numberOfNurses, setNumberOfNurses] = useState<number>(0);
  const [numberOfSitters, setNumberOfSitters] = useState<number>(0);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const schedule = useSelector((state: ApplicationStateModel) => state.scheduleData?.present);

  const dispatcher = useDispatch();
  useEffect(() => {
    if (schedule) {
      const { year, month_number: monthNumber, UUID } = schedule.schedule_info || {};
      const [babysitterCount, nurseCount] = getWorkersCount(schedule);
      if (UUID) {
        handleDateChange(MonthInfoLogic.convertToDate(monthNumber, year));
      }

      if (babysitterCount) {
        setNumberOfSitters(babysitterCount);
      }
      if (nurseCount) {
        setNumberOfNurses(nurseCount);
      }
    }
  }, [schedule]);

  function showSnackbar(message: string): void {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  }

  function handleNumberOfNursesChange(): void {
    const nurseCount = getWorkersCount(schedule || {})[1];

    if (!nurseCount) {
      return;
    }

    if (nurseCount > numberOfNurses) {
      setNumberOfNurses(nurseCount);
      showSnackbar("Wprowadzono mniej pielęgniarek niż w harmonogramie");
    }
  }

  function handleNumberOfSittersChange(): void {
    const babysitterCount = getWorkersCount(schedule || {})[0];

    if (!babysitterCount) {
      return;
    }

    if (babysitterCount > numberOfSitters) {
      setNumberOfSitters(babysitterCount);
      showSnackbar("Wprowadzono mniej opiekunek niż w harmonogramie");
    }
  }

  async function onFixScheduleClicked(): Promise<void> {
    if (schedule) {
      const response = await backend.fixSchedule(schedule);
      dispatcher({
        type: ScheduleDataActionType.ADD_NEW,
        payload: response,
      });
      showSnackbar("Harmonogram został poprawiony");
    }
  }

  async function onShowErrorsClicked(): Promise<void> {
    if (schedule) {
      const response = await backend.getErrors(schedule);
      dispatcher({
        type: ScheduleErrorActionType.UPDATE,
        payload: response,
      } as ActionModel<ScheduleError[]>);
    }
  }

  function textField(
    id: string,
    label: string,
    value: number,
    setFunction: (value: number) => void,
    onTextFieldBlur?: () => void
  ): JSX.Element {
    return (
      <TextField
        required
        id={id}
        label={label}
        value={value}
        onChange={(e): void => setFunction(parseInt(e.target.value))}
        onBlur={onTextFieldBlur}
      />
    );
  }

  return (
    <form className="form" autoComplete="off">
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={plLocale}>
        <DatePicker
          required
          variant="inline"
          openTo="year"
          views={["year", "month"]}
          label="Z miesiąca"
          value={selectedDate}
          onChange={(date): void => {
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
      <div id="submit-button-container">
        <Box>
          <Button size="small" id="submit-button" variant="outlined" onClick={onFixScheduleClicked}>
            Popraw
          </Button>
        </Box>

        <Box>
          <Button size="small" id="submit-button" variant="outlined" onClick={onShowErrorsClicked}>
            Sprawdź
          </Button>
        </Box>
      </div>

      <SnackbarComponent
        alertMessage={snackbarMessage}
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        key={snackbarMessage}
      />
    </form>
  );
}
