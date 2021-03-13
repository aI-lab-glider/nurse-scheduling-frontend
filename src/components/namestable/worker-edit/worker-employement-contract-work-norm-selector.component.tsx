/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Grid, Input, Typography } from "@material-ui/core";
import * as _ from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { TimeDrawerType } from "../../../common-models/worker-info.model";
import { DropdownButtons } from "../../common-components/dropdown-buttons/dropdown-buttons.component";
import { TextMaskCustom } from "../../common-components/text-mask-custom/text-mask-custom.component";
import { WorkingTimeHelper } from "../working-time.helper";
import { FormFieldErrorLabel } from "./form-field-error-label.component";
import { useFormFieldStyles } from "./worker-edit.models";
import { WorkerContractTypeDependentWorkTimeSelectorOptions } from "./worker-contract-type-dependent-worktime-selector.component";

export function WorkerEmployementContractWorkNormSelector({
  employementTime,
  setWorkerTime,
  setIsFieldValid: setIsFormValid,
}: WorkerContractTypeDependentWorkTimeSelectorOptions): JSX.Element {
  const classes = useFormFieldStyles();
  const [selectedTimeType, setSelectedTimeType] = useState<TimeDrawerType>(TimeDrawerType.FULL);

  const handleContractTimeSelect = useCallback(
    (timeType: TimeDrawerType) => {
      setSelectedTimeType(timeType);
      if (timeType !== TimeDrawerType.OTHER) {
        setWorkerTime(toWorkNorm(timeType));
      }
    },
    [setSelectedTimeType, setWorkerTime]
  );

  const contractTimeDropdownOptions = useMemo(
    () =>
      Object.keys(TimeDrawerType).map((timeTypeName) => {
        const timeType = TimeDrawerType[timeTypeName];
        return {
          label: timeType,
          action: (): void => handleContractTimeSelect(timeType),
          dataCy: timeTypeName.toLowerCase(),
        };
      }),
    [handleContractTimeSelect]
  );

  function isEmployementTimeValid(employementTime?: number): boolean {
    const isValid = !_.isNil(employementTime) && employementTime <= 1;
    setIsFormValid?.(isValid);
    return isValid;
  }

  function toFraction(employementTime?: number): string | undefined {
    if (_.isNil(employementTime)) {
      return undefined;
    }
    return WorkingTimeHelper.fromWorkNormDecimalToWorkNormFraction(employementTime);
  }

  function toWorkNorm(fraction: string): number {
    return WorkingTimeHelper.fromFractionToDecimalWorkNorm(fraction);
  }

  const employementTimeAsFraction = toFraction(employementTime);
  return (
    <>
      <Grid item xs={6} style={{ zIndex: 2 }}>
        <DropdownButtons
          dataCy="contract-time-dropdown"
          buttons={contractTimeDropdownOptions}
          mainLabel={employementTimeAsFraction ?? "Wybierz etat pracownika"}
          buttonVariant="secondary"
          variant="contract-time-dropdown"
        />
      </Grid>
      {selectedTimeType === TimeDrawerType.OTHER && (
        <Grid item xs={6}>
          <Typography className={classes.label}>Wpisz wymiar etatu</Typography>
          <Input
            fullWidth
            name="employmentTimeOther"
            value={employementTimeAsFraction}
            onChange={(event): void => setWorkerTime(toWorkNorm(event.target.value))}
            data-cy="input-employ-time-other"
            style={{
              width: 100,
            }}
            className={classes.formInput}
            inputComponent={
              // eslint-disable-next-line
              TextMaskCustom as any
            }
          />
          <FormFieldErrorLabel
            condition={!isEmployementTimeValid(employementTime)}
            message="Etat powinien być mniejszy lub równy jeden"
          />
          @
        </Grid>
      )}
    </>
  );
}
