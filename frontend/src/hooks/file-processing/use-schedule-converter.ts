import { useEffect, useState } from "react";
import XLSXParser from "xlsx";
import Excel from 'exceljs'
import { DataRowParser } from "../../logic/schedule-parser/data-row.parser";
import { ScheduleParser } from "../../logic/schedule-parser/schedule.parser";
import { ScheduleDataModel } from "../../state/models/schedule-data/schedule-data.model";
import { ScheduleErrorModel } from "../../state/models/schedule-data/schedule-error.model";
import { useFileReader } from "./use-file-reader";

// eslint-disable-next-line @typescript-eslint/class-name-casing
export interface useScheduleConverterOutput {
  scheduleModel?: ScheduleDataModel;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scheduleSheet?: Array<Record<string, any>>;
  setSrcFile: (srcFile: File) => void;
  scheduleErrors: ScheduleErrorModel[];
}

export function useScheduleConverter(): useScheduleConverterOutput {
  const [scheduleErrors, setScheduleErrors] = useState<ScheduleErrorModel[]>([]);
  const [scheduleSheet, setScheduleSheet] = useState<Array<object>>();
  const [fileContent, setSrcFile] = useFileReader();
  const [scheduleModel, setScheduleModel] = useState<ScheduleDataModel>();

  function findDataEnd(scheduleSheet: Array<object>): number {
    const stopEmptyRowsCount = 4;
    let actualEmptyRowsCount = 0;
    let i;
    for (i = 0; actualEmptyRowsCount < stopEmptyRowsCount; ++i) {
      const row = new DataRowParser(scheduleSheet[i]);
      if (row.isEmpty) actualEmptyRowsCount += 1;
      else actualEmptyRowsCount = 0;
    }
    return i - stopEmptyRowsCount;
  }

  useEffect(() => {
    const cropToData = (scheduleSheet: Array<object>): object[] => {
      const end = findDataEnd(scheduleSheet);
      return scheduleSheet.slice(0, end);
    };

    const convertBinaryToObjectArray = (
      content: ArrayBuffer | undefined
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Array<Record<string, any>> => {
      if (!content) {
        return [];
      }

      const workbook = XLSXParser.read(content, { type: "array" });

      const scheduleSheet = XLSXParser.utils.sheet_to_json(Object.values(workbook.Sheets)[0], {
        defval: null,
        header: 1,
      }) as Array<object>;
      return cropToData(scheduleSheet);
    };

    const parsedFileContent = convertBinaryToObjectArray(fileContent);
    setScheduleSheet(parsedFileContent);
    if (Object.keys(parsedFileContent).length !== 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parser = new ScheduleParser(parsedFileContent as Array<Record<string, any>>);
      setScheduleErrors([
        ...parser.nurseInfoProvider.errors,
        ...parser.babysitterInfoProvider.errors,
      ]);
      setScheduleModel(parser.schedule.getDataModel());
    }
  }, [fileContent]);

  return {
    scheduleModel: scheduleModel,
    scheduleSheet: scheduleSheet,
    setSrcFile: setSrcFile,
    scheduleErrors: scheduleErrors,
  };
}
