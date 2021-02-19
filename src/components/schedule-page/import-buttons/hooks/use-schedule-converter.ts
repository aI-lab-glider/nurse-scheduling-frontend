/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { useEffect, useState } from "react";
import Excel from "exceljs";
import {
  cropScheduleDMToMonthDM,
  MonthDataModel,
} from "../../../../common-models/schedule-data.model";
import { InputFileErrorCode, ScheduleError } from "../../../../common-models/schedule-error.model";
import { ScheduleParser } from "../../../../logic/schedule-parser/schedule.parser";
import { useFileReader } from "./use-file-reader";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../../state/models/application-state.model";
import { fromBuffer } from "file-type/browser";
import { useNotification } from "../../../common-components/notification/notification.context";

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

  function readFileContent(workbook): void {
    const sheet = workbook.getWorksheet(1);

    if (sheet.rowCount === 0) {
      throw new Error(InputFileErrorCode.EMPTY_FILE);
    }

    const outerArray = Array<Array<Array<string>>>();
    let innerArray = Array<Array<string>>();

    sheet.eachRow((row) => {
      const rowValues = row.values as Array<string>;
      rowValues.shift();

      function isEmpty() {
        const rowValuesSet = new Set(rowValues.map((a) => a.toString()));
        let undefinedSeen = false;
        rowValuesSet.forEach((a) => {
          if (typeof a === "undefined") {
            undefinedSeen = true;
            return;
          }
        });
        return (
          undefinedSeen ||
          (rowValuesSet.size === 4 &&
            rowValuesSet.has("Nadgodziny") &&
            rowValuesSet.has("Godziny wypracowane") &&
            rowValuesSet.has("Godziny wymagane") &&
            rowValuesSet.has("")) ||
          (rowValuesSet.size === 1 && rowValuesSet.has(""))
        );
      }

      if (isEmpty()) {
        if (innerArray.length !== 0) {
          outerArray.push(innerArray);
        }
        innerArray = Array<Array<string>>();
      } else {
        innerArray.push(rowValues);
      }
    });

    if (outerArray.length === 0) {
      throw new Error(InputFileErrorCode.EMPTY_FILE);
    }

    if (Object.keys(outerArray).length !== 0) {
      const parser = new ScheduleParser(month, year, outerArray);

      setScheduleErrors([
        ...parser._parseErrors,
        ...parser.sections.Metadata.errors,
        ...parser.sections.FoundationInfo.errors,
      ]);
      setMonthModel(cropScheduleDMToMonthDM(parser.schedule.getDataModel()));

      createNotification({ type: "success", message: "Plan został wczytany!" });
    }
    return;
  }
}
