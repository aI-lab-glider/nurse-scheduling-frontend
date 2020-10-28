import { useEffect, useState } from "react";
import Excel from "exceljs";
import { ScheduleParser } from "../../logic/schedule-parser/schedule.parser";
import { ScheduleDataModel } from "../../state/models/schedule-data/schedule-data.model";
import { ScheduleErrorModel } from "../../state/models/schedule-data/schedule-error.model";
import { useFileReader } from "./use-file-reader";

export interface UseScheduleConverterOutput {
  scheduleModel?: ScheduleDataModel;
  scheduleSheet?: Array<object>;
  setSrcFile: (srcFile: File) => void;
  scheduleErrors: ScheduleErrorModel[];
}

export function useScheduleConverter(): UseScheduleConverterOutput {
  const [scheduleErrors, setScheduleErrors] = useState<ScheduleErrorModel[]>([]);
  const [scheduleSheet, setScheduleSheet] = useState<Array<object>>();
  const [fileContent, setSrcFile] = useFileReader();
  const [scheduleModel, setScheduleModel] = useState<ScheduleDataModel>();

  useEffect(() => {
    if (!fileContent) {
      return;
    }

    const workbook = new Excel.Workbook();
    workbook.xlsx.load(fileContent).then(() => {
      const sheet = workbook.getWorksheet(1);
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
        const parser = new ScheduleParser(parsedFileContent);
        setScheduleErrors([
          ...parser.nurseInfoProvider.errors,
          ...parser.babysitterInfoProvider.errors,
        ]);
        setScheduleModel(parser.schedule.getDataModel());
      }
    });
  }, [fileContent]);

  return {
    scheduleModel: scheduleModel,
    scheduleSheet: scheduleSheet,
    setSrcFile: setSrcFile,
    scheduleErrors: scheduleErrors,
  };
}
