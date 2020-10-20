/* eslint-disable @typescript-eslint/ban-types */
import { useEffect, useState } from "react";
import Excel from 'exceljs'
import { ScheduleParser } from "../../logic/schedule-parser/schedule.parser";
import { ScheduleDataModel } from "../../state/models/schedule-data/schedule-data.model";
import { ScheduleErrorModel } from "../../state/models/schedule-data/schedule-error.model";
// eslint-disable-next-line import/extensions
import { useFileReader } from "./use-file-reader";

// eslint-disable-next-line @typescript-eslint/class-name-casing
export interface useScheduleConverterOutput {
  scheduleModel?: ScheduleDataModel;
  scheduleSheet?: Array<Record<string, any>>;
  setSrcFile: (srcFile: File) => void;
  scheduleErrors: ScheduleErrorModel[];
}

export function useScheduleConverter(): useScheduleConverterOutput {
  const [scheduleErrors, setScheduleErrors] = useState<ScheduleErrorModel[]>([]);
  const [scheduleSheet, setScheduleSheet] = useState<Array<object>>();
  const [fileContent, setSrcFile] = useFileReader();
  const [scheduleModel, setScheduleModel] = useState<ScheduleDataModel>();

  useEffect(() => {
    if(!fileContent) {
      return
    }

    const workbook = new Excel.Workbook();
    workbook.xlsx.load(fileContent)
      .then(() => {
        const sheet = workbook.getWorksheet(1)
        const parsedFileContent = Array<Array<Object>>()
        sheet.eachRow((row, _) => {
          parsedFileContent.push(row.values as Array<Object>)
        })
        parsedFileContent.forEach(a => a.shift())

        while(parsedFileContent[parsedFileContent.length - 1][0] === "") {
          parsedFileContent.pop()
        }
        
        setScheduleSheet(parsedFileContent);
        if (Object.keys(parsedFileContent).length !== 0) {
          const parser = new ScheduleParser(parsedFileContent as Array<Object>);
          setScheduleErrors([
            ...parser.nurseInfoProvider.errors,
            ...parser.babysitterInfoProvider.errors,
          ]);
          setScheduleModel(parser.schedule.getDataModel());
        }
    })
  }, [fileContent]);

  return {
    scheduleModel: scheduleModel,
    scheduleSheet: scheduleSheet,
    setSrcFile: setSrcFile,
    scheduleErrors: scheduleErrors,
  };
}
