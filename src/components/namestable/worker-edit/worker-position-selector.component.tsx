/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Grid, Typography } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import { WorkerType } from "../../../common-models/worker-info.model";
import {
  ButtonData,
  DropdownButtons,
} from "../../common-components/dropdown-buttons/dropdown-buttons.component";
import { FormFieldErrorLabel } from "./form-field-error-label.component";
import {
  FormFieldOptions,
  translateAndCapitalizeWorkerType,
  useFormFieldStyles,
} from "./worker-edit.models";

interface WorkerPositionSelectorOptions extends FormFieldOptions {
  workerType?: WorkerType;
  setActualWorkerType: (newWorkerPosition: WorkerType) => void;
}

export function WorkerWorkerTypeSelector({
  workerType,
  setActualWorkerType,
  setIsFieldValid,
}: WorkerPositionSelectorOptions): JSX.Element {
  const classes = useFormFieldStyles();
  const [firstEditMade, setFirstEditMade] = useState(false);

  function handleWorkerTypeUpdate(workerType: WorkerType): void {
    setActualWorkerType(workerType);
    setFirstEditMade(true);
  }

  const positionOptions: ButtonData[] = Object.keys(WorkerType).map((workerTypeName) => {
    const workerType = WorkerType[workerTypeName];
    return {
      label: translateAndCapitalizeWorkerType(workerType),
      action: (): void => handleWorkerTypeUpdate(workerType),
      dataCy: workerTypeName.toLowerCase(),
    };
  });

  const isWorkerPositionValid = useCallback((): boolean => {
    return !!workerType;
  }, [workerType]);

  useEffect((): void => {
    setIsFieldValid?.(isWorkerPositionValid());
  }, [workerType, setIsFieldValid, isWorkerPositionValid]);
  return (
    <Grid item xs={6}>
      <Typography className={classes.label}>Stanowisko</Typography>
      <DropdownButtons
        dataCy="position"
        buttons={positionOptions}
        mainLabel={workerType ? translateAndCapitalizeWorkerType(workerType) : "Stanowisko"}
        buttonVariant="secondary"
        variant="position"
      />
      <FormFieldErrorLabel
        shouldBeVisible={!isWorkerPositionValid() && firstEditMade}
        message="Wybierz stanowisko pracownika"
      />
    </Grid>
  );
}
