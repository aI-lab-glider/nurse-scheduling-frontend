/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { useEffect, useState } from "react";
import Excel, { FillPattern } from "exceljs";
import { MonthDataModel } from "../../../../common-models/schedule-data.model";
import { InputFileErrorCode, ScheduleError } from "../../../../common-models/schedule-error.model";
import { ScheduleParser } from "../../../../logic/schedule-parser/schedule.parser";
import { useFileReader } from "./use-file-reader";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../../state/models/application-state.model";
import { fromBuffer } from "file-type/browser";
import { useNotification } from "../../../common-components/notification/notification.context";
import { cropScheduleDMToMonthDM } from "../../../../logic/schedule-container-convertion/schedule-container-convertion";
import {
  SHIFTS_WORKSHEET_NAME,
  WORKERS_WORKSHEET_NAME,
  WORKSHEET_NAME,
} from "../../../../logic/schedule-exporter/schedule-export.logic";

export interface UseScheduleConverterOutput {
  monthModel?: MonthDataModel;
  scheduleSheet?: Array<object>;
  setSrcFile: (srcFile: File) => void;
  scheduleErrors: ScheduleError[];
}

export function useScheduleConverter(): UseScheduleConverterOutput {
  const [scheduleErrors, setScheduleErrors] = useState<ScheduleError[]>([]);
  const [fileContent, setSrcFile] = useFileReader();
  const [monthModel, setMonthModel] = useState<MonthDataModel>();
  const { month_number: month, year } = useSelector(
    (state: ApplicationStateModel) => state.actualState.temporarySchedule.present.schedule_info
  );
  const { createNotification } = useNotification();
  const isFileMetaCorrect = async (fileContent: ArrayBuffer): Promise<boolean> => {
    const ext = await fromBuffer(fileContent);
    if (
      !ext ||
      ext.ext !== "xlsx" ||
      ext.mime !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setScheduleErrors([
        {
          kind: InputFileErrorCode.UNHANDLED_FILE_EXTENSION,
          filename: ext?.ext.toString(),
        },
      ]);
      setMonthModel(undefined);
      createNotification({ type: "error", message: "Plan nie został wczytany!" });
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!fileContent) {
      return;
    }

    isFileMetaCorrect(fileContent).then((val) => {
      if (val) {
        const workbook = new Excel.Workbook();
        workbook.xlsx.load(fileContent).then(() => {
          try {
            readFileContent(workbook);
          } catch (e) {
            setScheduleErrors([
              {
                kind: InputFileErrorCode.LOAD_FILE_ERROR,
                message: e.toString(),
              },
            ]);
            setMonthModel(undefined);
            createNotification({ type: "error", message: "Plan nie został wczytany!" });
          }
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileContent]);

  return {
    monthModel: monthModel,
    setSrcFile: setSrcFile,
    scheduleErrors: scheduleErrors,
  };

  function isEmpty(rowValues: Array<string>): boolean {
    const rowValuesSet = new Set(rowValues.map((a) => a.toString()));
    let undefinedSeen = false;
    rowValuesSet.forEach((a) => {
      if (typeof a === "undefined") {
        undefinedSeen = true;
        return;
      }
    });

    const cellsToAvoid = [
      "godziny wymagane",
      "godziny wypracowane",
      "nadgodziny",
      "grafik",
      "imię i nazwisko",
    ];

    return (
      undefinedSeen ||
      rowValuesSet.size === 0 ||
      (rowValuesSet.size === 4 &&
        Array.from(rowValuesSet).some((setItem) =>
          cellsToAvoid.some((cellToAvoid) => setItem.trim().toLowerCase().includes(cellToAvoid))
        )) ||
      Array.from(rowValuesSet).some((setItem) => setItem.trim().toLowerCase().includes("grafik")) ||
      Array.from(rowValuesSet).some((setItem) => setItem.trim().toLowerCase().includes("nazwa")) ||
      (rowValuesSet.size === 1 && rowValuesSet.has(""))
    );
  }

  function extractWorkers(workbook): Array<Array<string>> {
    const workers = Array<Array<string>>();
    const workersWorkSheet = workbook.getWorksheet(WORKERS_WORKSHEET_NAME);

    if (workersWorkSheet) {
      workersWorkSheet.eachRow(false, (row) => {
        const rowValues = Array<string>();

        let iter;
        for (iter = 1; iter <= row.cellCount; iter++) {
          rowValues.push(row.getCell(iter).text);
        }

        if (!isEmpty(rowValues)) {
          workers.push(rowValues);
        }
      });
    }
    return workers;
  }

  function extractShifts(workbook): Array<Array<string>> {
    const shifts = Array<Array<string>>();
    const shiftsWorkSheet = workbook.getWorksheet(SHIFTS_WORKSHEET_NAME);

    if (shiftsWorkSheet) {
      shiftsWorkSheet.eachRow(false, (row) => {
        const rowValues = Array<string>();

        let iter;
        for (iter = 1; iter <= 5; iter++) {
          rowValues.push(row.getCell(iter).text.trim().toLowerCase());
        }

        rowValues.push(
          (row.getCell(iter).style.fill as FillPattern).fgColor?.argb?.toString() ?? ""
        );

        if (!isEmpty(rowValues)) {
          shifts.push(rowValues);
        }
      });
    }
    return shifts;
  }

  function extractSchedule(workbook): Array<Array<Array<string>>> {
    const scheduleWorkSheet = workbook.getWorksheet(WORKSHEET_NAME);
    if (scheduleWorkSheet.rowCount === 0) {
      throw new Error(InputFileErrorCode.EMPTY_FILE);
    }

    const outerArray = Array<Array<Array<string>>>();
    let innerArray = Array<Array<string>>();

    let emptyCounter = 0;

    let rowIter;
    for (rowIter = 1; rowIter <= scheduleWorkSheet.rowCount; rowIter++) {
      const row = scheduleWorkSheet.getRow(rowIter);

      const rowValues = Array<string>();

      let iter;
      for (iter = 1; iter <= row.cellCount; iter++) {
        rowValues.push(row.getCell(iter).text);
      }

      if (isEmpty(rowValues)) {
        if (innerArray.length !== 0) {
          outerArray.push(innerArray);
        }
        innerArray = Array<Array<string>>();
        emptyCounter++;
      } else {
        innerArray.push(rowValues);
        emptyCounter = 0;
      }

      if (emptyCounter > 4) {
        break;
      }
    }

    if (outerArray.length === 0) {
      throw new Error(InputFileErrorCode.EMPTY_FILE);
    }
    return outerArray;
  }

  function readFileContent(workbook): void {
    const scheduleArray = extractSchedule(workbook);
    const workersArray = extractWorkers(workbook);
    const shiftsArray = extractShifts(workbook);

    if (Object.keys(scheduleArray).length !== 0) {
      const parser = new ScheduleParser(month, year, scheduleArray, workersArray, shiftsArray);

      setScheduleErrors([
        ...parser._parseErrors,
        ...parser.sections.Metadata.errors,
        ...parser.sections.FoundationInfo.errors,
        ...parser.workersInfo.errors,
        ...parser.shiftsInfo.errors,
      ]);
      setMonthModel(cropScheduleDMToMonthDM(parser.schedule.getDataModel()));

      createNotification({ type: "success", message: "Plan został wczytany!" });
    }
    return;
  }
}
