import {
  WorkerTypeHelper,
  WorkerType,
  ContractType,
  ContractTypeHelper,
} from "../../common-models/worker-info.model";
import { StringHelper } from "../../helpers/string.helper";

export function translateAndCapitalizeWorkerType(workerType: WorkerType): string {
  const translation = WorkerTypeHelper.translate(workerType);
  return StringHelper.capitalize(translation);
}

export function translateAndCapitalizeContractType(contractType: ContractType): string {
  const translation = ContractTypeHelper.translate(contractType);
  return StringHelper.capitalize(translation);
}
