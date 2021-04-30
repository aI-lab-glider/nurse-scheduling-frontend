/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Grid, Typography } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import { t } from "../../../../helpers/translations.helper";
import { ContractType } from "../../../../state/schedule-data/worker-info/worker-info.model";
import {
  ButtonData,
  DropdownButtons,
} from "../../../buttons/dropdown-buttons/dropdown-buttons.component";
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

  const [firstEditMade, setFirstEditMade] = useState(false);

  function handleWorkerTypeUpdate(contractType: ContractType): void {
    setWorkerContractType(contractType);
    setFirstEditMade(true);
  }

  const contractOptions: ButtonData[] = Object.keys(ContractType).map((contractTypeName) => {
    const contractType = ContractType[contractTypeName];
    return {
      label: translateAndCapitalizeContractType(contractType),
      action: (): void => handleWorkerTypeUpdate(contractType),
      dataCy: contractTypeName.toLowerCase(),
    };
  });

  const isContractTypeValid = useCallback((): boolean => {
    return !!workerContractType;
  }, [workerContractType]);

  useEffect(() => {
    setIsFieldValid?.(isContractTypeValid());
  }, [workerContractType, setIsFieldValid, isContractTypeValid]);
  return (
    <>
      <Grid item xs={6}>
        <Typography className={classes.label}>{t("workingTime")}</Typography>
        <DropdownButtons
          dataCy="contract"
          buttons={contractOptions}
          mainLabel={
            workerContractType
              ? translateAndCapitalizeContractType(workerContractType)
              : "Typ umowy"
          }
          buttonVariant="secondary"
          width={workerContractType ? 190 : 154}
        />

        <FormFieldErrorLabel
          shouldBeVisible={!isContractTypeValid() && firstEditMade}
          message={t("selectContractType")}
        />
      </Grid>
    </>
  );
}
