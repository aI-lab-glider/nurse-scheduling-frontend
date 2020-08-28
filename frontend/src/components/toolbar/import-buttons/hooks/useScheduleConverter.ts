import { useEffect, useState } from "react";
import XLSXParser from "xlsx";
import { ScheduleDataModel } from "../../../../state/models";
import { useFileReader } from "./useFileReader";

export const useScheduleConverter = (): [ScheduleDataModel, (srcFile: File) => void] => {
  const [fileContent, setSrcFile] = useFileReader();
  const [schedule, setSchedule] = useState<ScheduleDataModel>({});

  useEffect(() => {
    const convertedContent = convertToSchedule(fileContent);
    setSchedule(convertedContent);
  }, [fileContent]);

  const convertToSchedule = (fileContent: ArrayBuffer | undefined): ScheduleDataModel => {
    if (!fileContent) {
      return {} as ScheduleDataModel;
    }
    let workbook = XLSXParser.read(fileContent, { type: "array" });
    let schedule = Object.values(workbook.Sheets)[0];
    console.log(schedule);
    return {} as ScheduleDataModel;
  };
  return [schedule, setSrcFile];
};
