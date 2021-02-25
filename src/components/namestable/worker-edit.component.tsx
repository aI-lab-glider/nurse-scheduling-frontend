/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  ContractType,
  ContractTypeHelper,
  TimeDrawerType,
  WorkerInfoModel,
  WorkerType,
  WorkerTypeHelper,
} from "../../common-models/worker-info.model";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Input, TextField, Typography } from "@material-ui/core";
import { DropdownButtons } from "../common-components/dropdown-buttons/dropdown-buttons.component";
import { Button } from "../common-components";
import ScssVars from "../../assets/styles/styles/custom/_variables.module.scss";
import { TextMaskCustom } from "../common-components/text-mask-custom/text-mask-custom.component";
import { StringHelper } from "../../helpers/string.helper";
import { WorkingTimeHelper } from "./working-time.helper";
import { ScheduleDataActionCreator } from "../../state/reducers/month-state/schedule-data/schedule-data.action-creator";
import { useDispatch } from "react-redux";

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

export function WorkerEditComponent(info: WorkerInfoModel): JSX.Element {
  const classes = useStyles();
  const dispatcher = useDispatch();
  const [isCivilTimeValid, setCivilTimeValid] = useState(true);

  const [workerInfo, setWorkerInfo] = useState<WorkerInfoExtendedInterface>({
    workerName: info.name,
    prevName: info.name,
    workerType: info.type,
    contractType: undefined,
    employmentTime: "1/1",
    employmentTimeOther: " / ",
    civilTime: "0",
  });

  function handleUpdate(event): void {
    const { name, value } = event.target;
    if (name === "employmentTime") {
      updateWorkerInfoBatch({
        employmentTime: value,
        civilTime: WorkingTimeHelper.fromFractionToHours(value, 168),
      });
    } else if (name === "employmentTimeOther") {
      updateWorkerInfoBatch({
        employmentTimeOther: value,
        civilTime: WorkingTimeHelper.fromFractionToHours(value, 168),
      });
    } else if (name === "civilTime") {
      validateTime(value);
      updateWorkerInfoBatch({
        civilTime: value,
        employmentTimeOther: WorkingTimeHelper.fromHoursToFraction(value, 168),
      });
    } else {
      updateWorkerInfo(name, value);
    }
  }

  function updateWorkerInfoBatch(newStatePart): void {
    setWorkerInfo({ ...workerInfo, ...newStatePart });
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

  return (
    <Grid container className={classes.container} direction="column" justify="space-between">
      <Grid item>
        <Grid container direction="column" spacing={5}>
          <Grid item xs={9}>
            <Typography className={classes.label}>Imię i nazwisko</Typography>
            <TextField
              fullWidth
              name="workerName"
              data-cy="name"
              value={workerInfo.workerName}
              onChange={handleUpdate}
              color="primary"
            />
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
            <Grid item xs={6}>
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
        </Grid>
      </Grid>
      <Grid item>
        <Button
          variant={isCivilTimeValid ? "primary" : "secondary"}
          data-cy="saveWorkerInfoBtn"
          onClick={(): void => {
            if (isCivilTimeValid) {
              workerInfo.prevName === ""
                ? dispatcher(ScheduleDataActionCreator.addNewWorker(workerInfo))
                : dispatcher(ScheduleDataActionCreator.modifyWorker(workerInfo));
              if (info.setOpen) {
                info.setOpen(false);
              }
            }
          }}
        >
          Zapisz pracownika
        </Button>
      </Grid>
    </Grid>
  );
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
