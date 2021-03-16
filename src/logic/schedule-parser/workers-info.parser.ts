/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { InputFileErrorCode, ScheduleError } from "../../common-models/schedule-error.model";
import {
  ContractType,
  ContractTypeHelper,
  WorkerDescription,
  WorkerType,
  WorkerTypeHelper,
} from "../../common-models/worker-info.model";
import { StringHelper } from "../../helpers/string.helper";

export const DEFAULT_WORKER_TYPE = WorkerType.OTHER;
export const DEFAULT_CONTRACT_TYPE = ContractType.CIVIL_CONTRACT;
export const DEFAULT_TIME = 1;

export class WorkersInfoParser {
  private _workerInfoRows: { [key: string]: WorkerDescription } = {};
  private _parseErrors: ScheduleError[] = [];

  constructor(data: string[][]) {
    data.forEach((a) => {
      const worker = this.mapWorker(a);
      this._workerInfoRows[worker.name] = worker;
    });
  }

  public get errors(): ScheduleError[] {
    return [...this._parseErrors];
  }

  public get workerDescriptions(): WorkerDescription[] {
    return Object.values(this._workerInfoRows);
  }

  private logLoadFileError(msg: string): void {
    this._parseErrors.push({
      kind: InputFileErrorCode.LOAD_FILE_ERROR,
      message: msg,
    });
  }

  private parseWorkerName(personelRow: string[]): string {
    if (personelRow[0]) {
      return StringHelper.capitalizeEach(personelRow[0].toLowerCase(), " ");
    }
    return "";
  }

  private parseWorkerType(personelRow: string[], name: string): WorkerType {
    if (personelRow[1]) {
      switch (personelRow[1].trim().toLowerCase()) {
        case WorkerTypeHelper.translateToShort(WorkerType.OTHER).toLowerCase():
        case "0":
          return WorkerType.OTHER;
        case WorkerTypeHelper.translateToShort(WorkerType.NURSE).toLowerCase():
          return WorkerType.NURSE;
      }
    } else {
      this.logLoadFileError(
        "Nie ustawiono typu stanowiska dla pracownika: " +
          name +
          ". Przyjęto stanowisko: " +
          WorkerTypeHelper.translate(DEFAULT_WORKER_TYPE)
      );
    }
    return DEFAULT_WORKER_TYPE;
  }

  private parseContractType(personelRow: string[], name: string): ContractType {
    if (personelRow[2]) {
      switch (personelRow[2].trim().toLowerCase()) {
        case ContractTypeHelper.translateToShort(ContractType.EMPLOYMENT_CONTRACT).toLowerCase():
          return ContractType.EMPLOYMENT_CONTRACT;
        case ContractTypeHelper.translateToShort(ContractType.CIVIL_CONTRACT).toLowerCase():
          return ContractType.CIVIL_CONTRACT;
      }
    } else {
      this.logLoadFileError(
        "Nie ustawiono typu kontraktu dla pracownika: " +
          name +
          ". Przyjęto kontrakt: " +
          ContractTypeHelper.translate(DEFAULT_CONTRACT_TYPE)
      );
    }
    return DEFAULT_CONTRACT_TYPE;
  }

  private parseWOrkerTime(personelRow: string[], name: string): number {
    if (personelRow[3]) {
      const number = parseFloat(personelRow[3].trim());
      if (isNaN(number) || number < 0 || number > 1) {
        this.logLoadFileError(
          "Nieoczekiwana wartość dla wymiaru czasu dla pracownika: " +
            name +
            ". Przyjęto wymiar czasu: " +
            DEFAULT_TIME
        );
      } else {
        return number;
      }
    } else {
      this.logLoadFileError(
        "Nie ustawiono wymiaru czasu dla pracownika: " +
          name +
          ". Przyjęto wymiar czasu: " +
          DEFAULT_TIME
      );
    }
    return DEFAULT_TIME;
  }

  private mapWorker(row: string[]): WorkerDescription {
    const name = this.parseWorkerName(row);
    const type = this.parseWorkerType(row, name);
    const contract = this.parseContractType(row, name);
    const time = this.parseWOrkerTime(row, name);

    return { name: name, type: type, time: time, contractType: contract };
  }
}
