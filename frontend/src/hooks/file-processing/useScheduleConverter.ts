import { useEffect, useState } from "react";
import XLSXParser from "xlsx";
import { DataRow } from "../../logic/schedule/data-row.logic";
import { ScheduleLogic } from "../../logic/schedule/schedule.logic";
import { ScheduleDataModel } from "../../state/models/schedule-data/schedule-data.model";
import { useFileReader } from "./useFileReader";

export const useScheduleConverter = (): [
  ScheduleDataModel | undefined,
  Array<Object> | undefined,
  (srcFile: File) => void
] => {
  //#region members
  const [scheduleSheet, setScheduleSheet] = useState<Array<object>>();
  const [fileContent, setSrcFile] = useFileReader();
  const [schedule, setSchedule] = useState<ScheduleDataModel>();
  //#endregion

  //#region logic

  const cropToData = (scheduleSheet: Array<object>) => {
    let end = findDataEnd(scheduleSheet);
    return scheduleSheet.slice(0, end);
  };

  const findDataEnd = (scheduleSheet: Array<object>) => {
    // empty row is a pattern
    let stopPatternLen = 4;
    let actualPatternLen = 0;
    for (var i = 0; actualPatternLen < stopPatternLen; ++i) {
      let row = new DataRow(scheduleSheet[i]);
      if (row.isEmpty) actualPatternLen += 1;
      else actualPatternLen = 0;
    }
    return i - stopPatternLen;
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

    return cropToData(scheduleSheet);
  };

  //#endregion

  //#region effects
  useEffect(() => {
    let parsedFileContent = convertBinaryToObjectArray(fileContent);
    setScheduleSheet(parsedFileContent);
    if (Object.keys(parsedFileContent).length != 0) {
      const logic = new ScheduleLogic(parsedFileContent as Array<Object>);
      setSchedule(logic.asDict());
    }
  }, [fileContent]);
  //#endregion

  return [schedule, scheduleSheet, setSrcFile];
};
