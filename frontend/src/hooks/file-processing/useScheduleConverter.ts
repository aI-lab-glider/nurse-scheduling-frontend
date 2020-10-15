import { useEffect, useState } from "react";
import XLSXParser from "xlsx";
import { DataRowParser } from "../../logic/schedule-parser/data-row.parser";
import { ScheduleParser } from "../../logic/schedule-parser/schedule.parser";
import { ScheduleDataModel } from "../../state/models/schedule-data/schedule-data.model";
import { ScheduleErrorModel } from "../../state/models/schedule-data/schedule-error.model";
import { useFileReader } from "./useFileReader";

export interface useScheduleConverterOutput {
  scheduleModel?: ScheduleDataModel;
  scheduleSheet?: Array<Object>;
  setSrcFile: (srcFile: File) => void;
  scheduleErrors: ScheduleErrorModel[];
}

export const useScheduleConverter = (): useScheduleConverterOutput => {
  //#region members
  const [scheduleErrors, setScheduleErrors] = useState<ScheduleErrorModel[]>([]);
  const [scheduleSheet, setScheduleSheet] = useState<Array<object>>();
  const [fileContent, setSrcFile] = useFileReader();
  const [scheduleModel, setScheduleModel] = useState<ScheduleDataModel>();
  //#endregion

  //#region logic

  const findDataEnd = (scheduleSheet: Array<object>) => {
    // empty row is a pattern
    let stopPatternLen = 4;
    let actualPatternLen = 0;
    for (var i = 0; actualPatternLen < stopPatternLen; ++i) {
      let row = new DataRowParser(scheduleSheet[i]);
      if (row.isEmpty) actualPatternLen += 1;
      else actualPatternLen = 0;
    }
    return i - stopPatternLen;
  };

  //#endregion

  //#region effects
  useEffect(() => {
    const cropToData = (scheduleSheet: Array<object>) => {
      let end = findDataEnd(scheduleSheet);
      return scheduleSheet.slice(0, end);
    };

    const convertBinaryToObjectArray = (content: ArrayBuffer | undefined): Array<Object> => {
      if (!content) {
        return [];
      }

      let workbook = XLSXParser.read(content, { type: "array" });

      let scheduleSheet = XLSXParser.utils.sheet_to_json(Object.values(workbook.Sheets)[0], {
        defval: null,
        header: 1,
      }) as Array<object>;
      console.log(scheduleSheet);
      return cropToData(scheduleSheet);
    };

    let parsedFileContent = convertBinaryToObjectArray(fileContent);
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
  //#endregion

  return {
    scheduleModel: scheduleModel,
    scheduleSheet: scheduleSheet,
    setSrcFile: setSrcFile,
    scheduleErrors: scheduleErrors,
  };
};
