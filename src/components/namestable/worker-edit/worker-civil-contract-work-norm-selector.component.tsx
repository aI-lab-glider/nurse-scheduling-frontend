/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Grid, TextField, Typography } from "@material-ui/core";
import * as _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { WorkerHourInfo } from "../../../helpers/worker-hours-info.model";
import { useMonthInfo } from "../../schedule-page/validation-drawer/use-verbose-dates";
import { WorkNormSelectorOptions } from "./combined-worknorm-selector.component";
import { FormFieldErrorLabel } from "./form-field-error-label.component";
import { useFormFieldStyles } from "./worker-edit.models";

export function WorkerCivilContractWorkNormSelector({
  employmentTime,
  setWorkerTime,
  setIsFieldValid: setIsFormValid,
}: WorkNormSelectorOptions): JSX.Element {
  const [firstEditMade, setFirstEditMade] = useState(false);

  const { year, monthNumber } = useMonthInfo();
  const requiredHours = WorkerHourInfo.calculateWorkNormForMonth(monthNumber, year);

  const convertToNormalHours = useCallback(
    (workNorm: number): number => {
      return Math.floor(workNorm * requiredHours);
    },
    [requiredHours]
  );

  const [workerCivilTime, setWorkerCivilTime] = useState(
    convertToNormalHours(employmentTime).toString()
  );

  useEffect(() => {
    setWorkerCivilTime(convertToNormalHours(employmentTime).toString());
  }, [employmentTime, setWorkerCivilTime, convertToNormalHours]);

  const classes = useFormFieldStyles();

  const maximumWorkHoursForMonth = requiredHours * 2;
  function isTimeValid(): boolean {
    const workerTimeCivilTimeAsNumber = parseInt(workerCivilTime);
    const isTimeValid =
      !_.isNaN(workerTimeCivilTimeAsNumber) &&
      workerTimeCivilTimeAsNumber < maximumWorkHoursForMonth;
    setIsFormValid?.(isTimeValid);
    return isTimeValid;
  }

  function toWorkerNorm(workerHours: string | number): number {
    const workerHoursAsNumber = parseInt(workerHours.toString());
    if (_.isNaN(workerHoursAsNumber)) {
      return 1;
    }
    return workerHoursAsNumber / requiredHours;
  }

  function handleCivilTimeChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    setWorkerCivilTime(event.target.value);
    setFirstEditMade(true);
  }

  return (
    <>
      <Grid item xs={6}>
        <Typography className={classes.label}>Ilość godzin</Typography>
        <TextField
          fullWidth
          name="civilTime"
          data-cy="input-civil-time"
          value={workerCivilTime}
          type="number"
          style={{
            width: 100,
          }}
          className={classes.formInput}
          onChange={handleCivilTimeChange}
          onBlur={(): void => setWorkerTime(toWorkerNorm(workerCivilTime))}
          color="primary"
        />
        <FormFieldErrorLabel
          shouldBeVisible={!isTimeValid() && firstEditMade}
          message={`Liczba godzin musi być w przedziałe od 0 do ${maximumWorkHoursForMonth}`}
        />
      </Grid>
    </>
  );
}
