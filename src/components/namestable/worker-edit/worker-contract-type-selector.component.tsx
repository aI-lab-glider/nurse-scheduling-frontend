/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Grid, Typography } from "@material-ui/core";
import React, { useCallback, useEffect, useMemo } from "react";
import { ContractType } from "../../../common-models/worker-info.model";
import { DropdownButtons } from "../../common-components/dropdown-buttons/dropdown-buttons.component";
import { FormFieldErrorLabel } from "./form-field-error-label.component";
import {
  FormFieldOptions,
  translateAndCapitalizeContractType,
  useFormFieldStyles,
} from "./worker-edit.models";

interface WorkerContractTypeSelectorOptions extends FormFieldOptions {
  workerContractType?: ContractType;
  setWorkerContractType: (contractType: ContractType) => void;
}

export function WorkerContractTypeSelector({
  workerContractType,
  setWorkerContractType,
  setIsFieldValid,
}: WorkerContractTypeSelectorOptions): JSX.Element {
  const classes = useFormFieldStyles();

  const contractOptions = useMemo(
    () =>
      Object.keys(ContractType).map((contractTypeName) => {
        const contractType = ContractType[contractTypeName];
        return {
          label: translateAndCapitalizeContractType(contractType),
          action: (): void => setWorkerContractType(contractType),
          dataCy: contractTypeName.toLowerCase(),
        };
      }),
    [setWorkerContractType]
  );

  const isContractTypeValid = useCallback((): boolean => {
    return !!workerContractType;
  }, [workerContractType]);

  useEffect(() => {
    setIsFieldValid?.(isContractTypeValid());
  }, [workerContractType, setIsFieldValid, isContractTypeValid]);
  return (
    <>
      <Grid item xs={6}>
        <Typography className={classes.label}>Wymiar pracy</Typography>
        <DropdownButtons
          dataCy="contract"
          buttons={contractOptions}
          mainLabel={
            workerContractType
              ? translateAndCapitalizeContractType(workerContractType)
              : "Typ umowy"
          }
          buttonVariant="secondary"
          variant="contract"
        />

        <FormFieldErrorLabel
          condition={!isContractTypeValid()}
          message="Typ umowy musi być zdefiniowany dla pracownika"
        />
      </Grid>
    </>
  );
}
