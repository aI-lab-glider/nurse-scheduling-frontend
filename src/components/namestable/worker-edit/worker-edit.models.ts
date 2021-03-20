/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { makeStyles } from "@material-ui/core";
import {
  ContractType,
  ContractTypeHelper,
  WorkerInfoModel,
  WorkerType,
  WorkerTypeHelper,
} from "../../../common-models/worker-info.model";
import { StringHelper } from "../../../helpers/string.helper";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";

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
}

export enum WorkerEditComponentMode {
  EDIT = "edit",
  ADD = "add",
}
export interface WorkerEditComponentOptions extends WorkerInfoModel {
  mode: WorkerEditComponentMode;
  setOpen: (open: boolean) => void;
}
