/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { ContractType } from "../../../common-models/worker-info.model";
import { FormFieldOptions } from "./worker-edit.models";
import { WorkerEmployementContractWorkNormSelector } from "./worker-employement-contract-work-norm-selector.component";
import { WorkerCivilContractWorkNormSelector } from "./worker-civil-contract-work-norm-selector.component";

export interface WorkerContractTypeDependentWorkTimeSelectorOptions extends FormFieldOptions {
  workerContractType?: ContractType;
  employementTime: number;
  setWorkerTime: (newWorkerTime: number) => void;
}

export function WorkerContractTypeDependentWorkTimeSelectror(
  options: WorkerContractTypeDependentWorkTimeSelectorOptions
): JSX.Element {
  const { workerContractType } = options;

  return (
    <>
      {workerContractType &&
        {
          [ContractType.CIVIL_CONTRACT]: <WorkerCivilContractWorkNormSelector {...options} />,
          [ContractType.EMPLOYMENT_CONTRACT]: (
            <WorkerEmployementContractWorkNormSelector {...options} />
          ),
        }[workerContractType]}
    </>
  );
}
