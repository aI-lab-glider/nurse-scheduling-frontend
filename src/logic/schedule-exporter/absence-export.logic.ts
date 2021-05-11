/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import xlsx from "exceljs";
import { RevisionType } from "../data-access/persistance-store.model";
import { ScheduleDataModel } from "../../state/schedule-data/schedule-data.model";
import { FileHelper } from "../../helpers/file.helper";
import { PrimaryMonthRevisionDataModel } from "../../state/application-state.model";
import { EMPTY_ROW_SIZE, LEAVES_WORKSHEET_NAME } from "../../helpers/parser.helper";
import { WorkersAbsenceExportLogic } from "./workers-absence-export.logic";
import { cropScheduleDMToMonthDM } from "../schedule-container-converter/schedule-container-converter";

export interface AbsenceExportLogicOptions {
  scheduleModel: ScheduleDataModel;
  primaryScheduleModel?: PrimaryMonthRevisionDataModel;
}

export class AbsenceExportLogic {
  private scheduleModel: ScheduleDataModel;

  private workerExportLogic: WorkersAbsenceExportLogic;

  constructor({ scheduleModel, primaryScheduleModel }: AbsenceExportLogicOptions) {
    this.scheduleModel = scheduleModel;
    this.workerExportLogic = new WorkersAbsenceExportLogic({
      scheduleModel,
      primaryScheduleModel,
    });
  }

  public formatAndSave(revisionType: RevisionType): void {
    const [finalName, workbook] = this.createWorkbook(revisionType);
    FileHelper.saveToFile(workbook, finalName);
  }

  public createWorkbook(revisionType: RevisionType): [string, xlsx.Workbook] {
    const [workbook, workersWorkSheet] = AbsenceExportLogic.createWorkArea();

    this.workerExportLogic.setWorkersWorkSheet(workersWorkSheet);

    const workbookName = FileHelper.createMonthFilename(
      cropScheduleDMToMonthDM(this.scheduleModel),
      revisionType
    );
    return [workbookName, workbook];
  }

  private static createWorkArea(): [xlsx.Workbook, xlsx.Worksheet] {
    const workbook = new xlsx.Workbook();
    return [
      workbook,
      workbook.addWorksheet(LEAVES_WORKSHEET_NAME, {
        pageSetup: { paperSize: 9, orientation: "landscape" },
        properties: { defaultColWidth: 5 },
      }),
    ];
  }

  public static isEmptyRow(row: xlsx.Row): boolean {
    for (let i = 1; i < EMPTY_ROW_SIZE + 1; i++) {
      if (row.getCell(i).value !== "") {
        return false;
      }
    }
    return true;
  }
}
