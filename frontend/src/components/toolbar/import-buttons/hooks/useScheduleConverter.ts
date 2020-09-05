import { useEffect, useState } from "react";
import XLSXParser from "xlsx";
import { DataRow } from "../../../../logic/schedule/data-row.logic";
import { ScheduleLogic } from "../../../../logic/schedule/schedule.logic";
import { ScheduleDataModel } from "../../../../state/models";
import { useFileReader } from "./useFileReader";

export const useScheduleConverter = (): [ScheduleDataModel, (srcFile: File) => void] => {
  //#region members
  const [fileContent, setSrcFile] = useFileReader();
  const [schedule, setSchedule] = useState<ScheduleDataModel>({});
  //#endregion

  //#region effects
  useEffect(() => {
    const convertedContent = convertToSchedule(fileContent);
    setSchedule(convertedContent);
  }, [fileContent]);
  //#endregion

  //#region logic
  const convertToSchedule = (fileContent: ArrayBuffer | undefined): ScheduleDataModel => {
    if (!fileContent) {
      return {} as ScheduleDataModel;
    }

    let workbook = XLSXParser.read(fileContent, { type: "array" });

    let scheduleSheet = XLSXParser.utils.sheet_to_json(Object.values(workbook.Sheets)[0], {
      defval: null,
      header: 1,
    }) as Array<object>;
    scheduleSheet = cropToData(scheduleSheet);
    let schedule = new ScheduleLogic(scheduleSheet);
    console.log(schedule.asDict());
    return schedule.asDict();
  };

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
  //#endregion

  return [schedule, setSrcFile];
};
