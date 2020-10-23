import { useEffect, useState } from "react";
import XLSXParser from "xlsx";
import { DataRowParser } from "../../logic/schedule-parser/data-row.parser";
import { ScheduleParser } from "../../logic/schedule-parser/schedule.parser";
import { ScheduleDataModel } from "../../state/models/schedule-data/schedule-data.model";
import { ScheduleErrorModel } from "../../state/models/schedule-data/schedule-error.model";
import { useFileReader } from "./use-file-reader";

export interface useScheduleConverterOutput {
  scheduleModel?: ScheduleDataModel;
  scheduleSheet?: Array<Object>;
  setSrcFile: (srcFile: File) => void;
  scheduleErrors: ScheduleErrorModel[];
}

export function useScheduleConverter(): useScheduleConverterOutput {
  const [scheduleErrors, setScheduleErrors] = useState<ScheduleErrorModel[]>([]);
  const [scheduleSheet, setScheduleSheet] = useState<Array<object>>();
  const [fileContent, setSrcFile] = useFileReader();
  const [scheduleModel, setScheduleModel] = useState<ScheduleDataModel>();

  function findDataEnd(scheduleSheet: Array<object>) {
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
    const cropToData = (scheduleSheet: Array<object>) => {
      const end = findDataEnd(scheduleSheet);
      return scheduleSheet.slice(0, end);
    };

    const convertBinaryToObjectArray = (content: ArrayBuffer | undefined): Array<Object> => {
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
      const parser = new ScheduleParser(parsedFileContent as Array<Object>);
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
