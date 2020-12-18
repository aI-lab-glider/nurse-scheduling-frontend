import {
  WorkerTypeHelper,
  WorkerType,
  ContractType,
  ContractTypeHelper,
} from "../../common-models/worker-info.model";

export function translateAndCapitalizeWorkerType(workerType: WorkerType): string {
  const translation = WorkerTypeHelper.translate(workerType);
  return capitalize(translation);
}

export function translateAndCapitalizeContractType(contractType: ContractType): string {
  const translation = ContractTypeHelper.translate(contractType);
  return capitalize(translation);
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
