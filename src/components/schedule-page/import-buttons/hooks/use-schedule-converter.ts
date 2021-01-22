/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { useEffect, useState } from "react";
import Excel from "exceljs";
import { ScheduleDataModel } from "../../../../common-models/schedule-data.model";
import { InputFileErrorCode, ScheduleError } from "../../../../common-models/schedule-error.model";
import { ScheduleParser } from "../../../../logic/schedule-parser/schedule.parser";
import { useFileReader } from "./use-file-reader";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../../state/models/application-state.model";

export interface UseScheduleConverterOutput {
  scheduleModel?: ScheduleDataModel;
  scheduleSheet?: Array<object>;
  setSrcFile: (srcFile: File) => void;
  scheduleErrors: ScheduleError[];
  errorOccurred: boolean;
}

export function useScheduleConverter(): UseScheduleConverterOutput {
  const [scheduleErrors, setScheduleErrors] = useState<ScheduleError[]>([]);
  const [scheduleSheet, setScheduleSheet] = useState<Array<object>>();
  const [fileContent, setSrcFile] = useFileReader();
  const [scheduleModel, setScheduleModel] = useState<ScheduleDataModel>();
  const [errorOccurred, setErrorOccurredFlag] = useState<boolean>(false);
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
        setErrorOccurredFlag(true);

        setScheduleErrors([
          {
            kind: InputFileErrorCode[e.message as keyof typeof InputFileErrorCode],
          },
        ]);

        setScheduleModel(undefined);
      }
    });
  }, [fileContent]);

  return {
    scheduleModel: scheduleModel,
    scheduleSheet: scheduleSheet,
    setSrcFile: setSrcFile,
    scheduleErrors: scheduleErrors,
    errorOccurred: errorOccurred,
  };

  function readFileContent(workbook): void {
    const sheet = workbook.getWorksheet(1);
    if (sheet.rowCount === 0) {
      throw new Error(InputFileErrorCode.EMPTY_FILE);
    }

    const parsedFileContent = Array<Array<string>>();
    sheet.eachRow((row, _) => {
      parsedFileContent.push(row.values as Array<string>);
    });
    parsedFileContent.forEach((a) => a.shift());

    while (parsedFileContent[parsedFileContent.length - 1][0] === "") {
      parsedFileContent.pop();
    }

    setScheduleSheet(parsedFileContent);
    if (Object.keys(parsedFileContent).length !== 0) {
      const parser = new ScheduleParser(month, year, parsedFileContent);
      setScheduleErrors([
        ...parser.sections.NurseInfo.errors,
        ...parser.sections.BabysitterInfo.errors,
      ]);
      setScheduleModel(parser.schedule.getDataModel());
    }
    return;
  }
}
