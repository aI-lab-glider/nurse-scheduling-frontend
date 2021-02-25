/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Grid, Input, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames/bind";
import * as _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScssVars from "../../assets/styles/styles/custom/_variables.module.scss";
import {
  ContractType,
  ContractTypeHelper,
  TimeDrawerType,
  WorkerInfoModel,
  WorkerType,
  WorkerTypeHelper,
} from "../../common-models/worker-info.model";
import { ShiftHelper } from "../../helpers/shifts.helper";
import { StringHelper } from "../../helpers/string.helper";
import { ApplicationStateModel } from "../../state/models/application-state.model";
import { ScheduleDataActionCreator } from "../../state/reducers/month-state/schedule-data/schedule-data.action-creator";
import { Button } from "../common-components";
import { DropdownButtons } from "../common-components/dropdown-buttons/dropdown-buttons.component";
import { TextMaskCustom } from "../common-components/text-mask-custom/text-mask-custom.component";
import { useMonthInfo } from "../schedule-page/validation-drawer/use-verbose-dates";
import { WorkingTimeHelper } from "./working-time.helper";

const useStyles = makeStyles({
  container: {
    height: "93%",
  },
  label: {
    fontSize: ScssVars.fontSizeBase,
    fontWeight: 700,
    lineHeight: ScssVars.lineHeightXl,
  },
});

export interface WorkerInfoExtendedInterface {
  workerName: string;
  prevName: string;
  workerType: WorkerType | undefined;
  contractType: ContractType | undefined;
  employmentTime: string;
  employmentTimeOther: string;
  civilTime: string;
}

export enum WorkerEditComponentMode {
  EDIT = "edit",
  ADD = "add",
}
export interface WorkerEditComponentOptions extends WorkerInfoModel {
  mode: WorkerEditComponentMode;
  setOpen: (open: boolean) => void;
}

const initialWorkerModel: WorkerInfoExtendedInterface = {
  workerName: "",
  prevName: "",
  workerType: undefined,
  contractType: undefined,
  employmentTime: "1/1",
  employmentTimeOther: " / ",
  civilTime: "0",
};

export function WorkerEditComponent(options: WorkerEditComponentOptions): JSX.Element {
  const classes = useStyles();
  const dispatcher = useDispatch();
  const [isCivilTimeValid, setCivilTimeValid] = useState(true);
  const [workerInfo, setWorkerInfo] = useState<WorkerInfoExtendedInterface>(initialWorkerModel);

  // #region setting up state
  useEffect(() => {
    setWorkerInfo({
      ...initialWorkerModel,
      workerName: options.name,
      workerType: options.type,
      prevName: options.name,
    });
  }, [setWorkerInfo, options.name, options.type]);

  const { monthNumber, year } = useMonthInfo();

  const getEmployeeTime = useCallback(
    (
      workerTime: number
    ): Pick<
      WorkerInfoExtendedInterface,
      "employmentTime" | "employmentTimeOther" | "civilTime"
    > => {
      const workerBaseNorm = ShiftHelper.calculateWorkNormForMonth(monthNumber, year);
      const hours = workerTime * workerBaseNorm;
      const hoursFraction = WorkingTimeHelper.fromHoursToFraction(hours, workerBaseNorm);
      return {
        employmentTime: hoursFraction.toString(),
        employmentTimeOther: hoursFraction.toString(),
        civilTime: hours.toString(),
      };
    },
    [year, monthNumber]
  );

  const { time, contractType } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present.employee_info
  );

  const updateWorkerInfoBatch = useCallback(
    (newStatePart: Partial<WorkerInfoExtendedInterface>): void => {
      setWorkerInfo((prev) => ({ ...prev, ...newStatePart }));
    },
    [setWorkerInfo]
  );

  const workerTime = useSelector(
    (state: ApplicationStateModel) =>
      state.actualState.persistentSchedule.present.employee_info.time
  );

  const [workerNames, setWorkerNames] = useState<string[]>([]);
  useEffect(() => {
    setWorkerNames(Object.keys(workerTime));
  }, [workerTime]);

  function isWorkerExists(workerName: string): boolean {
    return workerNames.includes(workerName) && options.mode !== WorkerEditComponentMode.EDIT;
  }

  useEffect(() => {
    updateWorkerInfoBatch({
      contractType: contractType?.[workerInfo.workerName],
      ...getEmployeeTime(time[workerInfo.workerName]),
    });
  }, [time, contractType, updateWorkerInfoBatch, workerInfo.workerName, getEmployeeTime]);

  const [isEmployementTimeValid, setIsEmployementTimeValid] = useState(true);

  //#endregion

  function handleUpdate(event): void {
    const { name, value } = event.target;
    const workerBaseNorm = ShiftHelper.calculateWorkNormForMonth(monthNumber, year);
    if (name === "employmentTime") {
      setIsEmployementTimeValid(WorkingTimeHelper.isTimeFractionValid(value));
      updateWorkerInfoBatch({
        employmentTime: value.toString(),
        civilTime: WorkingTimeHelper.fromFractionToHours(value, workerBaseNorm).toString(),
      });
    } else if (name === "employmentTimeOther") {
      setIsEmployementTimeValid(WorkingTimeHelper.isTimeFractionValid(value));
      updateWorkerInfoBatch({
        employmentTimeOther: value.toString(),
        civilTime: WorkingTimeHelper.fromFractionToHours(value, workerBaseNorm).toString(),
      });
    } else if (name === "civilTime") {
      validateTime(value);
      updateWorkerInfoBatch({
        civilTime: value,
        employmentTimeOther: WorkingTimeHelper.fromHoursToFraction(value, workerBaseNorm),
      });
    } else {
      updateWorkerInfo(name, value);
    }
  }

  function isValidInfo(worker: WorkerInfoExtendedInterface): boolean {
    const validEmplTime =
      (workerInfo.contractType === ContractType.EMPLOYMENT_CONTRACT && isEmployementTimeValid) ||
      workerInfo.contractType !== ContractType.EMPLOYMENT_CONTRACT;

    const validCivilTime =
      (worker.contractType === ContractType.CIVIL_CONTRACT &&
        worker.civilTime !== "0" &&
        parseInt(worker.civilTime) < 700) ||
      worker.contractType !== ContractType.CIVIL_CONTRACT;

    const validContractType = worker.contractType !== undefined;

    return (
      worker.workerName !== "" &&
      !_.isNil(worker.workerType) &&
      !_.isNil(contractType) &&
      validEmplTime &&
      validCivilTime &&
      validContractType &&
      !isWorkerExists(worker.workerName)
    );
  }
  function updateWorkerInfo(key, value): void {
    setWorkerInfo({ ...workerInfo, [key]: value });
  }

  const positionOptions = Object.keys(WorkerType).map((workerTypeName) => {
    const workerType = WorkerType[workerTypeName];
    return {
      label: translateAndCapitalizeWorkerType(workerType),
      action: (): void => updateWorkerInfo("workerType", workerType),
      dataCy: "worker-button",
    };
  });

  function validateTime(value: string): void {
    setCivilTimeValid(+value < 744);
  }

  function handleClose(): void {
    options.mode === WorkerEditComponentMode.ADD
      ? dispatcher(ScheduleDataActionCreator.addNewWorker(workerInfo))
      : dispatcher(ScheduleDataActionCreator.modifyWorker(workerInfo));

    setWorkerInfo(initialWorkerModel);
    options.setOpen(false);
  }
  const contractOptions = Object.keys(ContractType).map((contractTypeName) => {
    const contractType = ContractType[contractTypeName];
    return {
      label: translateAndCapitalizeContractType(contractType),
      action: (): void => updateWorkerInfo("contractType", contractType),
      dataCy: "contract-button",
    };
  });

  const contractTimeDrawerOptions = Object.keys(TimeDrawerType).map((timeTypeName) => {
    const timeType = TimeDrawerType[timeTypeName];
    return {
      label: timeType,
      action: (): void => updateWorkerInfo("employmentTime", timeType),
      dataCy: "time-contract-button",
    };
  });

  // #region view
  return (
    <Grid container className={classes.container} direction="column" justify="space-between">
      <Grid item>
        <Grid container direction="column" spacing={5}>
          <Grid item xs={6}>
            <Typography className={classes.label}>Imię i nazwisko</Typography>
            <TextField
              fullWidth
              name="workerName"
              data-cy="name"
              value={workerInfo.workerName}
              onChange={handleUpdate}
              color="primary"
            />

            <Grid item xs={12} style={{ minHeight: 30 }}>
              <Typography className={classes.label} style={{ color: "red" }}>
                {" "}
                {isWorkerExists(workerInfo.workerName) &&
                  `Pracownik o imieniu ${workerInfo.workerName} już istnieje`}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.label}>Stanowisko</Typography>
            <DropdownButtons
              dataCy="position"
              buttons={positionOptions}
              mainLabel={
                workerInfo.workerType
                  ? translateAndCapitalizeWorkerType(workerInfo.workerType)
                  : "Stanowisko"
              }
              buttonVariant="secondary"
              variant="position"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.label}>Wymiar pracy</Typography>
            <Grid container>
              <Grid item>
                <DropdownButtons
                  dataCy="contract"
                  buttons={contractOptions}
                  mainLabel={
                    workerInfo.contractType
                      ? translateAndCapitalizeContractType(workerInfo.contractType)
                      : "Typ umowy"
                  }
                  buttonVariant="secondary"
                  variant="contract"
                />
              </Grid>
            </Grid>
          </Grid>
          {workerInfo.contractType === ContractType.EMPLOYMENT_CONTRACT && (
            <Grid item xs={6} style={{ zIndex: 2 }}>
              <DropdownButtons
                dataCy="contract-time-dropdown"
                buttons={contractTimeDrawerOptions}
                mainLabel={workerInfo.employmentTime}
                buttonVariant="secondary"
                variant="contract-time-dropdown"
              />
            </Grid>
          )}
          {workerInfo.contractType === ContractType.CIVIL_CONTRACT && (
            <Grid item xs={6}>
              <Typography className={classes.label}>Ilość godzin</Typography>
              <TextField
                fullWidth
                name="civilTime"
                data-cy="civilTime"
                value={workerInfo.civilTime}
                type="number"
                onChange={handleUpdate}
                color="primary"
              />
            </Grid>
          )}
          {workerInfo.contractType === ContractType.CIVIL_CONTRACT && !isCivilTimeValid && (
            <Grid item xs={12}>
              <Typography className={classes.label} style={{ color: "red" }}>
                Ilość godzin jest za duża
              </Typography>
            </Grid>
          )}
          {workerInfo.contractType === ContractType.EMPLOYMENT_CONTRACT &&
            workerInfo.employmentTime === TimeDrawerType.OTHER && (
              <Grid item xs={6}>
                <Typography className={classes.label}>Wpisz wymiar etatu</Typography>
                <Input
                  fullWidth
                  name="employmentTimeOther"
                  value={workerInfo.employmentTimeOther}
                  onChange={handleUpdate}
                  data-cy="employmentTimeOther"
                  inputComponent={
                    // eslint-disable-next-line
                    TextMaskCustom as any
                  }
                />
              </Grid>
            )}

          {workerInfo.contractType === ContractType.EMPLOYMENT_CONTRACT && !isEmployementTimeValid && (
            <Grid item xs={12}>
              <Typography className={classes.label} style={{ color: "red" }}>
                Etat powinien być mniejszy lub równy jeden
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item>
        <Button
          disabled={!isValidInfo(workerInfo)}
          variant={"primary"}
          className={classNames({ "disabled-submit-button": !isValidInfo(workerInfo) })}
          data-cy="saveWorkerInfoBtn"
          onClick={handleClose}
        >
          Zapisz pracownika
        </Button>
      </Grid>
    </Grid>
  );
  //#endregion
}

function translateAndCapitalizeWorkerType(workerType: WorkerType): string {
  return translateAndCapitalize(workerType, WorkerTypeHelper);
}

function translateAndCapitalizeContractType(contractType: ContractType): string {
  return translateAndCapitalize(contractType, ContractTypeHelper);
}

function translateAndCapitalize<T>(what: T, using: { translate: (what: T) => string }): string {
  const translation = using.translate(what);
  return StringHelper.capitalize(translation);
}
