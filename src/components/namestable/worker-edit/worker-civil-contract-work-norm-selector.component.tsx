/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Grid, TextField, Typography } from "@material-ui/core";
import * as _ from "lodash";
import React from "react";
import { WorkerHourInfo } from "../../../helpers/worker-hours-info.model";
import { useMonthInfo } from "../../schedule-page/validation-drawer/use-verbose-dates";
import { FormFieldErrorLabel } from "./form-field-error-label.component";
import { useFormFieldStyles } from "./worker-edit.models";
import { WorkerContractTypeDependentWorkTimeSelectorOptions } from "./worker-contract-type-dependent-worknorm-selector.component";

export function WorkerCivilContractWorkNormSelector({
  employementTime,
  setWorkerTime,
  setIsFieldValid: setIsFormValid,
}: WorkerContractTypeDependentWorkTimeSelectorOptions): JSX.Element {
  const classes = useFormFieldStyles();
  const { year, monthNumber } = useMonthInfo();
  const requiredHours = WorkerHourInfo.calculateWorkNormForMonth(monthNumber, year);

  function convertToNormalHours(workNorm: number): number {
    return workNorm * requiredHours;
  }

  const maximumWorkHoursForMonth = requiredHours * 2;
  function isTimeValid(): boolean {
    const hours = convertToNormalHours(employementTime);
    const isTimeValid = hours < maximumWorkHoursForMonth;
    setIsFormValid?.(isTimeValid);
    return isTimeValid;
  }

  function toWorkerNorm(workerHoursAsString: string): number {
    const workerHours = parseInt(workerHoursAsString);
    if (_.isNaN(workerHoursAsString)) {
      return 0;
    }
    return workerHours / requiredHours;
  }

  return (
    <>
      <Grid item xs={6}>
        <Typography className={classes.label}>Ilość godzin</Typography>
        <TextField
          fullWidth
          name="civilTime"
          data-cy="input-civil-time"
          value={convertToNormalHours(employementTime)}
          type="number"
          style={{
            width: 100,
          }}
          className={classes.formInput}
          onBlur={(event): void => setWorkerTime(toWorkerNorm(event.target.value))}
          color="primary"
        />
        <FormFieldErrorLabel
          condition={!isTimeValid()}
          message={`Liczba godzin musi być mniejsza od ${maximumWorkHoursForMonth}`}
        />
      </Grid>
    </>
  );
}
