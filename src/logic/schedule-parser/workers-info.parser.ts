/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { InputFileErrorCode, ScheduleError } from "../../common-models/schedule-error.model";
import {
  ContractType,
  ContractTypeHelper,
  WorkerAllInfoModel,
  WorkerType,
  WorkerTypeHelper,
} from "../../common-models/worker-info.model";
import { StringHelper } from "../../helpers/string.helper";

export const DEFAULT_WORKER_TYPE = WorkerType.OTHER;
export const DEFAULT_CONTRACT_TYPE = ContractType.CIVIL_CONTRACT;
export const DEFAULT_TIME = 1;

export class WorkersInfoParser {
  private _workerInfoRows: { [key: string]: WorkerAllInfoModel } = {};
  private _parseErrors: ScheduleError[] = [];

  constructor(data: string[][]) {
    this.myWorker(data).forEach((worker) => {
      this._workerInfoRows[worker.name] = worker;
    });
  }

  public get errors(): ScheduleError[] {
    return [...this._parseErrors];
  }

  private logLoadFileError(msg: string): void {
    this._parseErrors.push({
      kind: InputFileErrorCode.LOAD_FILE_ERROR,
      message: msg,
    });
  }

  private myWorker(raw: string[][]): WorkerAllInfoModel[] {
    const sectionData: WorkerAllInfoModel[] = [];

    raw.forEach((personelRow) => {
      if (personelRow.length > 0) {
        const name = StringHelper.capitalizeEach(personelRow[0].toLowerCase(), " ");

        let type = DEFAULT_WORKER_TYPE;

        if (personelRow[1]) {
          switch (personelRow[1].trim().toLowerCase()) {
            case "o":
            case "0":
              type = WorkerType.OTHER;
              break;
            case "p":
              type = WorkerType.NURSE;
              break;
          }
        } else {
          this.logLoadFileError(
            "Nie ustawiono typu stanowiska dla pracownika : " +
              name +
              ". Przyjęto stanowisko: " +
              WorkerTypeHelper.translate(DEFAULT_WORKER_TYPE)
          );
        }

        let contract = DEFAULT_CONTRACT_TYPE;

        if (personelRow[2]) {
          switch (personelRow[2].trim().toLowerCase()) {
            case "uop":
              contract = ContractType.EMPLOYMENT_CONTRACT;
              break;
            case "uz":
              contract = ContractType.CIVIL_CONTRACT;
              break;
          }
        } else {
          this.logLoadFileError(
            "Nie ustawiono typu kontraktu dla pracownika : " +
              name +
              ". Przyjęto kontakt: " +
              ContractTypeHelper.translate(DEFAULT_CONTRACT_TYPE)
          );
        }

        let time = DEFAULT_TIME;

        if (personelRow[3]) {
          const number = parseInt(personelRow[3].trim());
          if (isNaN(number) || number < 0) {
            this.logLoadFileError(
              "Nieoczekiwana wartość dla wymiaru czasu dla pracownika : " +
                name +
                ". Przyjęto wymiar czasu: " +
                DEFAULT_TIME
            );
          } else {
            time = number;
          }
        } else {
          this.logLoadFileError(
            "Nie ustawiono wymiaru czasu dla pracownika : " +
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
