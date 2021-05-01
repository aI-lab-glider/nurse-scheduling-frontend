/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { makeStyles } from "@material-ui/core";
import ScssVars from "../../../../assets/styles/styles/custom/_variables.module.scss";
import { ContractTypeHelper } from "../../../../helpers/contract-type.helper";
import { StringHelper } from "../../../../helpers/string.helper";
import { WorkerTypeHelper } from "../../../../helpers/worker-type.helper";
import { WorkerName } from "../../../../state/schedule-data/schedule-sensitive-data.model";
import {
  ContractType,
  Team,
  WorkerType
} from "../../../../state/schedule-data/worker-info/worker-info.model";

export interface FormFieldOptions {
  setIsFieldValid?: (status: boolean) => void;
}

export function translateAndCapitalizeWorkerType(workerType: WorkerType): string {
  return translateAndCapitalize(workerType, WorkerTypeHelper);
}

export function translateAndCapitalizeContractType(contractType: ContractType): string {
  return translateAndCapitalize(contractType, ContractTypeHelper);
}

export function translateAndCapitalize<T>(
  what: T,
  using: { translate: (what: T) => string }
): string {
  const translation = using.translate(what);
  return StringHelper.capitalize(translation);
}

export const useFormFieldStyles = makeStyles({
  label: {
    fontSize: ScssVars.fontSizeBase,
    fontWeight: 700,
    lineHeight: ScssVars.lineHeightXl,
    marginLeft: "4%",
  },
  formInput: {
    marginLeft: "4%",
  },
  errorLabel: {
    fontSize: ScssVars.fontSizeSm,
    fontWeight: 100,
    marginLeft: "4%",
    color: "red",
    height: 20,
  },
});

export interface WorkerInfoExtendedInterface {
  workerName: string;
  prevName: string;
  workerType?: WorkerType;
  contractType?: ContractType;
  time: number;
  team: Team;
}

export enum WorkerEditComponentMode {
  EDIT = "edit",
  ADD = "add",
}

export interface WorkerEditOptions {
  mode: WorkerEditComponentMode.EDIT;
  name: WorkerName;
}
export interface WorkerAddOptions {
  mode: WorkerEditComponentMode.ADD;
}

export type WorkerEditComponentOptions = (WorkerEditOptions | WorkerAddOptions) & {
  setOpen: (open: boolean) => void;
};
