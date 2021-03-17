/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Grid, Input, Typography } from "@material-ui/core";
import * as _ from "lodash";
import React, { useState } from "react";
import { TimeDrawerType } from "../../../common-models/worker-info.model";
import {
  ButtonData,
  DropdownButtons,
} from "../../common-components/dropdown-buttons/dropdown-buttons.component";
import { TextMaskCustom } from "../../common-components/text-mask-custom/text-mask-custom.component";
import { WorkingTimeHelper } from "../working-time.helper";
import { WorkNormSelectorOptions } from "./combined-worknorm-selector.component";
import { FormFieldErrorLabel } from "./form-field-error-label.component";
import { useFormFieldStyles } from "./worker-edit.models";

export function WorkerEmploymentContractWorkNormSelector({
  employmentTime,
  setWorkerTime,
  setIsFieldValid: setIsFormValid,
}: WorkNormSelectorOptions): JSX.Element {
  const classes = useFormFieldStyles();
  const [selectedTimeType, setSelectedTimeType] = useState<TimeDrawerType>(TimeDrawerType.FULL);
  const [firstEditMade, setFirstEditMade] = useState(false);

  function handleContractTimeSelect(timeType: TimeDrawerType): void {
    setSelectedTimeType(timeType);
    if (timeType !== TimeDrawerType.OTHER) {
      setWorkerTime(toWorkNorm(timeType));
    }
  }

  const contractTimeDropdownOptions: ButtonData[] = Object.keys(TimeDrawerType).map(
    (timeTypeName) => {
      const timeType = TimeDrawerType[timeTypeName];
      return {
        label: timeType,
        action: (): void => handleContractTimeSelect(timeType),
        dataCy: timeTypeName.toLowerCase(),
      };
    }
  );

  function isEmploymentTimeValid(employmentTime?: number): boolean {
    const isValid = !_.isNil(employmentTime) && employmentTime <= 1;
    setIsFormValid?.(isValid);
    return isValid;
  }

  function toFraction(employmentTime?: number): string | undefined {
    if (_.isNil(employmentTime)) {
      return undefined;
    }
    return WorkingTimeHelper.fromDecimalToFraction(employmentTime);
  }

  function toWorkNorm(fraction: string): number {
    return WorkingTimeHelper.fromFractionToDecimal(fraction);
  }

  function handleWorkerTimeUpdate(
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const workerNorm = toWorkNorm(event.target.value);
    setWorkerTime(workerNorm);
    setFirstEditMade(true);
  }

  const employmentTimeAsFraction = toFraction(employmentTime);
  return (
    <>
      <Grid item xs={6} style={{ zIndex: 2 }}>
        <DropdownButtons
          dataCy="contract-time-dropdown"
          buttons={contractTimeDropdownOptions}
          mainLabel={employmentTimeAsFraction ?? "Wybierz etat pracownika"}
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
            value={employmentTimeAsFraction}
            onBlur={handleWorkerTimeUpdate}
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
            shouldBeVisible={!isEmploymentTimeValid(employmentTime) && firstEditMade}
            message="Pracownik nie może być zatrudniony na więcej niż jeden etat"
          />
        </Grid>
      )}
    </>
  );
}
