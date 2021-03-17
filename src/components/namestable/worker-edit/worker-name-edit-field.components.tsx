/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Grid, TextField, Typography } from "@material-ui/core";
import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import {
  FormFieldErrorLabelOptions,
  FormFieldErrorLabelStack,
} from "./form-field-error-label.component";
import {
  FormFieldOptions,
  useFormFieldStyles,
  WorkerEditComponentMode,
} from "./worker-edit.models";

export interface WorkerNameEditFieldOptions extends FormFieldOptions {
  workerName: string;
  setWorkerName: (newWorkerName: string) => void;
  mode: WorkerEditComponentMode;
}

export function WorkerNameEditField({
  workerName,
  setWorkerName,
  setIsFieldValid,
  mode,
}: WorkerNameEditFieldOptions): JSX.Element {
  const classes = useFormFieldStyles();
  const [firstEditMade, setFirstEditMade] = useState(false);

  const workerNames = useSelector((state: ApplicationStateModel) =>
    Object.keys(state.actualState.persistentSchedule.present.employee_info.type)
  );

  const isWorkerWithSameNameExists = useCallback((): boolean => {
    const isWorkerNameInvalid =
      workerNames.includes((workerName ?? "").trim()) && mode !== WorkerEditComponentMode.EDIT;
    return isWorkerNameInvalid;
  }, [mode, workerName, workerNames]);

  const isWorkerNameEmpty = useCallback((): boolean => {
    return workerName === "";
  }, [workerName]);

  useEffect(() => {
    const isNameValid = !isWorkerNameEmpty() && !isWorkerWithSameNameExists();
    setIsFieldValid?.(isNameValid);
  }, [workerName, setIsFieldValid, isWorkerWithSameNameExists, isWorkerNameEmpty]);

  const nameFieldErrorLabels: FormFieldErrorLabelOptions[] = [
    {
      shouldBeVisible: isWorkerWithSameNameExists() && firstEditMade,
      message: `Pracownik o imieniu i nazwisku: ${workerName} już istnieje`,
    },
    {
      shouldBeVisible: isWorkerNameEmpty() && firstEditMade,
      message: "Wpisz imię i nazwisko pracownika",
    },
  ];

  const handleWorkerNameChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setWorkerName(event.target.value);
      setFirstEditMade(true);
    },
    [setWorkerName]
  );
  return (
    <>
      <Grid item xs={6}>
        <Typography className={classes.label}>Imię i nazwisko</Typography>
        <TextField
          fullWidth
          name="workerName"
          className={classes.formInput}
          style={{
            marginBottom: 5,
          }}
          data-cy="name"
          value={workerName}
          onChange={handleWorkerNameChange}
          color="primary"
        />
        <FormFieldErrorLabelStack errorLabels={nameFieldErrorLabels} />
      </Grid>
    </>
  );
}
