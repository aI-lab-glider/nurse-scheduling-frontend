import {
  ContractType,
  ContractTypeHelper,
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

const useStyles = makeStyles({
  container: {
    height: "100%",
  },
  label: {
    fontSize: ScssVars.fontSizeBase,
    fontWeight: 700,
    lineHeight: ScssVars.lineHeightXl,
  },
});

export interface WorkerInfoExtendedInterface {
  name: string;
  workerType: WorkerType | undefined;
  contractType: ContractType | undefined;
  employmentTime: string;
  employmentTimeOther: string;
  civilTime: string;
}

export function WorkerEditComponent(info: WorkerInfoModel): JSX.Element {
  const classes = useStyles();

  const [workerInfo, setWorkerInfo] = useState<WorkerInfoExtendedInterface>({
    name: info.name,
    workerType: info.type,
    contractType: undefined,
    employmentTime: "1/1",
    employmentTimeOther: " / ",
    civilTime: "0",
  });

  function handleUpdate(event): void {
    const { name, value } = event.target;
    updateWorkerInfo(name, value);
  }

  function updateWorkerInfo(key, value): void {
    setWorkerInfo({ ...workerInfo, [key]: value });
  }

  const positionOptions = Object.keys(WorkerType).map((workerTypeName) => {
    const workerType = WorkerType[workerTypeName];
    return {
      label: translateAndCapitalizeWorkerType(workerType),
      action: (): void => updateWorkerInfo("workerType", workerType),
    };
  });

  const contractOptions = Object.keys(ContractType).map((contractTypeName) => {
    const contractType = ContractType[contractTypeName];
    return {
      label: translateAndCapitalizeContractType(contractType),
      action: (): void => updateWorkerInfo("contractType", contractType),
    };
  });

  const contractTimeDrawerOptions = Object.keys(TimeDrawerType).map((timeTypeName) => {
    const timeType = TimeDrawerType[timeTypeName];
    return {
      label: timeType,
      action: (): void => updateWorkerInfo("employmentTime", timeType),
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
              name="name"
              data-cy="name"
              value={workerInfo.name}
              onChange={handleUpdate}
              color="primary"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.label}>Stanowisko</Typography>
            <DropdownButtons
              data-cy="position"
              buttons={positionOptions}
              mainLabel={
                workerInfo.workerType
                  ? translateAndCapitalizeWorkerType(workerInfo.workerType)
                  : "Stanowisko"
              }
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.label}>Wymiar pracy</Typography>
            <Grid container>
              <Grid item>
                <DropdownButtons
                  data-cy="contract"
                  buttons={contractOptions}
                  mainLabel={
                    workerInfo.contractType
                      ? translateAndCapitalizeContractType(workerInfo.contractType)
                      : "Typ umowy"
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item>
                <DropdownButtons
                  data-cy="contract-time-dropdown"
                  buttons={contractTimeDrawerOptions}
                  mainLabel={workerInfo.employmentTime}
                  variant="outlined"
                  disabled={workerInfo.contractType !== ContractType.EMPLOYMENT_CONTRACT}
                />
              </Grid>
            </Grid>
          </Grid>
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
          {workerInfo.contractType === ContractType.EMPLOYMENT_CONTRACT &&
            workerInfo.employmentTime === TimeDrawerType.OTHER && (
              <Grid item xs={6}>
                <Typography className={classes.label}>Wpisz wymiar etatu</Typography>
                <Input
                  fullWidth
                  name="employmentTimeOther"
                  value={workerInfo.employmentTimeOther}
                  onChange={handleUpdate}
                  data-cy="hours-number"
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
        <Button>Zapisz pracownika</Button>
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
