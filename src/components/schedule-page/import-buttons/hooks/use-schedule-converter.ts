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

export interface UseScheduleConverterOutput {
  monthModel?: MonthDataModel;
  scheduleSheet?: Array<object>;
  setSrcFile: (srcFile: File) => void;
  scheduleErrors: ScheduleError[];
}

export function useScheduleConverter(): UseScheduleConverterOutput {
  const [scheduleErrors, setScheduleErrors] = useState<ScheduleError[]>([]);
  const [scheduleSheet, setScheduleSheet] = useState<Array<object>>();
  const [fileContent, setSrcFile] = useFileReader();
  const [monthModel, setMonthModel] = useState<MonthDataModel>();
  const { month_number: month, year } = useSelector(
    (state: ApplicationStateModel) => state.actualState.temporarySchedule.present.schedule_info
  );

  useEffect(() => {
    if (!fileContent) {
      return;
    }

    const workbook = new Excel.Workbook();
    workbook.xlsx.load(fileContent).then(() => {
      try {
        readFileContent(workbook);
      } catch (e) {
        setScheduleErrors([
          {
            kind: InputFileErrorCode.EMPTY_FILE,
          },
        ]);

        setMonthModel(undefined);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileContent]);

  return {
    monthModel: monthModel,
    scheduleSheet: scheduleSheet,
    setSrcFile: setSrcFile,
    scheduleErrors: scheduleErrors,
  };

  function readFileContent(workbook): void {
    const sheet = workbook.getWorksheet(1);

    if (sheet.rowCount === 0) {
      throw new Error(InputFileErrorCode.EMPTY_FILE);
    }

    const golden = Array<Array<Array<string>>>();
    let silver = Array<Array<string>>();

    sheet.eachRow((row, _) => {
      const rowValues = row.values as Array<string>;
      rowValues.shift();

      function notEmpty() {
        const rowValuesSet = new Set(rowValues.map((x) => x.toString()));
        return rowValuesSet.size === 1 && rowValuesSet.values().next().value === "";
      }

      if (notEmpty()) {
        if (silver.length !== 0) {
          golden.push(silver);
        }
        silver = Array<Array<string>>();
      } else {
        silver.push(rowValues);
      }
    });

    setScheduleSheet(golden);

    if (Object.keys(golden).length !== 0) {
      const parser = new ScheduleParser(golden);

      setScheduleErrors([
        ...parser._parseErrors,
        ...parser.sections.Metadata.errors,
        ...parser.sections.FoundationInfo.errors,
        ...parser.sections.NurseInfo.errors,
        ...parser.sections.BabysitterInfo.errors,
      ]);
      //todo coto
      setMonthModel(cropScheduleDMToMonthDM(parser.schedule.getDataModel()));
    }
    return;
  }
}
