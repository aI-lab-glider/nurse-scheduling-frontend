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

export function WorkerEditComponent(info: WorkerInfoModel): JSX.Element {
  const classes = useStyles();

  const [name, setName] = useState(info.name);
  const [workerType, setWorkerType] = useState(info.type);
  const [contractType, setContractType] = useState<ContractType>();
  const [uopTime, setUopTime] = useState(" / ");
  const [contractorTime, setContractorTime] = useState(0);

  const positionOptions = Object.keys(WorkerType).map((workerTypeName) => {
    const workerType = WorkerType[workerTypeName];
    return {
      label: translateAndCapitalizeWorkerType(workerType),
      action: () => setWorkerType(workerType),
    };
  });

  const contractOptions = Object.keys(ContractType).map((contractTypeName) => {
    const contractType = ContractType[contractTypeName];
    return {
      label: translateAndCapitalizeContractType(contractType),
      action: () => setContractType(contractType),
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
              data-cy="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              color="primary"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.label}>Stanowisko</Typography>
            <DropdownButtons
              data-cy="position"
              buttons={positionOptions}
              mainLabel={workerType ? translateAndCapitalizeWorkerType(workerType) : "Stanowisko"}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.label}>Wymiar pracy</Typography>
            <DropdownButtons
              data-cy="contract"
              buttons={contractOptions}
              mainLabel={
                contractType ? translateAndCapitalizeContractType(contractType) : "Typ umowy"
              }
              variant="outlined"
            />
          </Grid>
          {contractType === ContractType.UOP && (
            <Grid item xs={6}>
              <Typography className={classes.label}>Wpisz wymiar etatu</Typography>
              <TextField
                fullWidth
                data-cy="contractor"
                value={contractorTime}
                type="number"
                onChange={(e) => setContractorTime(parseInt(e.target.value))}
                color="primary"
              />
            </Grid>
          )}
          {contractType === ContractType.CONTRACTOR && (
            <Grid item xs={6}>
              <Typography className={classes.label}>Ilość godzin</Typography>
              <Input
                fullWidth
                value={uopTime}
                onChange={(e) => setUopTime(e.target.value)}
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
