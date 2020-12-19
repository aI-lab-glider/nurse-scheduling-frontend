import { ContractType, WorkerInfoModel, WorkerType } from "../../common-models/worker-info.model";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Input, TextField, Typography } from "@material-ui/core";
import { DropdownButtons } from "../common-components/dropdown-buttons/dropdown-buttons.component";
import {
  translateAndCapitalizeContractType,
  translateAndCapitalizeWorkerType,
} from "./worker-edit.helper";
import MaskedInput from "react-text-mask";
import { Button } from "../common-components";

const useStyles = makeStyles({
  container: {
    height: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: 700,
    lineHeight: 1.75,
  },
});

export interface WorkerInfoExtendedInterface {
  name: string;
  workerType: WorkerType | undefined;
  contractType: ContractType | undefined;
  employmentTime: string;
  civilTime: string;
}

export function WorkerEditComponent(info: WorkerInfoModel): JSX.Element {
  const classes = useStyles();

  const [workerInfo, setWorkerInfo] = useState<WorkerInfoExtendedInterface>({
    name: info.name,
    workerType: info.type,
    contractType: undefined,
    employmentTime: " / ",
    civilTime: "0",
  });

  function handleUpdate(event) {
    const { target } = event;
    updateWorkerInfo(target.name, target.value);
  }

  function updateWorkerInfo(key, value) {
    setWorkerInfo({ ...workerInfo, [key]: value });
  }

  const positionOptions = Object.keys(WorkerType).map((workerTypeName) => {
    const workerType = WorkerType[workerTypeName];
    return {
      label: translateAndCapitalizeWorkerType(workerType),
      action: () => updateWorkerInfo("workerType", workerType),
    };
  });

  const contractOptions = Object.keys(ContractType).map((contractTypeName) => {
    const contractType = ContractType[contractTypeName];
    return {
      label: translateAndCapitalizeContractType(contractType),
      action: () => updateWorkerInfo("contractType", contractType),
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
          <Grid item xs={6}>
            <Typography className={classes.label}>Wymiar pracy</Typography>
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
          {workerInfo.contractType === ContractType.EMPLOYMENT_CONTRACT && (
            <Grid item xs={6}>
              <Typography className={classes.label}>Wpisz wymiar etatu</Typography>
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
          {workerInfo.contractType === ContractType.CIVIL_CONTRACT && (
            <Grid item xs={6}>
              <Typography className={classes.label}>Ilość godzin</Typography>
              <Input
                fullWidth
                name="employmentTime"
                value={workerInfo.employmentTime}
                onChange={handleUpdate}
                data-cy="hours-number"
                inputComponent={TextMaskCustom as any}
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

interface TextMaskCustomProps {
  inputRef: (ref: HTMLInputElement | null) => void;
}

function TextMaskCustom(props: TextMaskCustomProps) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref: any) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/[1-9]/, "/", /[1-9]/]}
      showMask
    />
  );
}
