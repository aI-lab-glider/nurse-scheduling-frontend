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
  private _workerDescriptions: WorkerDescription[] = [];
  private _parseErrors: ScheduleError[] = [];

  constructor(data: string[][]) {
    this._workerDescriptions = this.mapWorkers(data);

    this._workerDescriptions.forEach((worker) => {
      this._workerInfoRows[worker.name] = worker;
    });
  }

  public get errors(): ScheduleError[] {
    return [...this._parseErrors];
  }

  public get workerDescriptions(): WorkerDescription[] {
    return this._workerDescriptions;
  }

  private logLoadFileError(msg: string): void {
    this._parseErrors.push({
      kind: InputFileErrorCode.LOAD_FILE_ERROR,
      message: msg,
    });
  }

  private mapWorkers(raw: string[][]): WorkerDescription[] {
    const sectionData: WorkerDescription[] = [];

    raw.forEach((personelRow) => {
      if (personelRow.length > 0) {
        const name = StringHelper.capitalizeEach(personelRow[0].toLowerCase(), " ");

        let type = DEFAULT_WORKER_TYPE;

        if (personelRow[1]) {
          switch (personelRow[1].trim().toLowerCase()) {
            case WorkerTypeHelper.translateToShort(WorkerType.OTHER).toLowerCase():
            case "0":
              type = WorkerType.OTHER;
              break;
            case WorkerTypeHelper.translateToShort(WorkerType.NURSE).toLowerCase():
              type = WorkerType.NURSE;
              break;
          }
        } else {
          this.logLoadFileError(
            "Nie ustawiono typu stanowiska dla pracownika: " +
              name +
              ". Przyjęto stanowisko: " +
              WorkerTypeHelper.translate(DEFAULT_WORKER_TYPE)
          );
        }

        let contract = DEFAULT_CONTRACT_TYPE;

        if (personelRow[2]) {
          switch (personelRow[2].trim().toLowerCase()) {
            case ContractTypeHelper.translateToShort(
              ContractType.EMPLOYMENT_CONTRACT
            ).toLowerCase():
              contract = ContractType.EMPLOYMENT_CONTRACT;
              break;
            case ContractTypeHelper.translateToShort(ContractType.CIVIL_CONTRACT).toLowerCase():
              contract = ContractType.CIVIL_CONTRACT;
              break;
          }
        } else {
          this.logLoadFileError(
            "Nie ustawiono typu kontraktu dla pracownika: " +
              name +
              ". Przyjęto kontrakt: " +
              ContractTypeHelper.translate(DEFAULT_CONTRACT_TYPE)
          );
        }

        let time = DEFAULT_TIME;

        if (personelRow[3]) {
          const number = parseFloat(personelRow[3].trim());
          if (isNaN(number) || number < 0) {
            this.logLoadFileError(
              "Nieoczekiwana wartość dla wymiaru czasu dla pracownika: " +
                name +
                ". Przyjęto wymiar czasu: " +
                DEFAULT_TIME
            );
          } else {
            time = number;
          }
        } else {
          this.logLoadFileError(
            "Nie ustawiono wymiaru czasu dla pracownika: " +
              name +
              ". Przyjęto wymiar czasu: " +
              DEFAULT_TIME
          );
        }

        sectionData.push({ name: name, type: type, time: time, contractType: contract });
      }
    });
    return sectionData;
  }
}
