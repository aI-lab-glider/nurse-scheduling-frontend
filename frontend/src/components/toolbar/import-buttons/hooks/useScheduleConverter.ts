import { useEffect, useState } from "react";
import XLSXParser from "xlsx";
import { ScheduleDataModel } from "../../../../state/models";
import { EmployeeRole } from "../../../../state/models/schedule-data/employee-info.model";
import { MonthInfoModel } from "../../../../state/models/schedule-data/month-info.model";
import { Shift, ShiftInfoModel } from "../../../../state/models/schedule-data/shift-info.model";
import { useFileReader } from "./useFileReader";


// To ask: 
// 1. employee_info comes from metadata
// TODO refactor
// TODO 
// moth service: should take moth and convert it to object
interface MonthModel {
  day_count: number
};


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

    let month = { day_count: 31}
    let workbook = XLSXParser.read(fileContent, { type: "array" });
  
    // here we receive an array of rows, with valuse
    let schedule = XLSXParser.utils.sheet_to_json(Object.values(workbook.Sheets)[0], { defval: null, header: 1 }) as Array<object>;
    return {
        shifts: parseShiftsFromSchedule(schedule, month),
        month_info: parseMonthInfoFromSchedule(schedule, month)
    } as ScheduleDataModel;
  };
  return [schedule, setSrcFile];
};


//# region parse table parts 
/**
 * Converts schedule to the form of rows.
 * @param schedule 
 */

const parseShiftsFromSchedule = (schedule: Array<Object>, month: MonthModel): ShiftInfoModel => {
  let shifts: ShiftInfoModel = {}
  schedule.forEach(row => {
      if (isRowContainsEmployeeInfo(row)) {
        let employee = row[0];
        shifts[employee] = getShiftsFromRow(row, month);
      }
  })
  return shifts;
}

const isRowContainsEmployeeInfo = (row: Object) => {
  let rowCode = row[0] && row[0].toLowerCase();
  return row[0] && rowCode.includes(EmployeeRole.BABYSITTER) || row[0] && rowCode.includes(EmployeeRole.NURSE);
}

const getShiftsFromRow = (row, month: MonthModel): Shift[] => {
  // TODO replace 31 with number of days in month
  let shifts: Shift[] = Object.values(row).slice(1, month.day_count + 1) as Shift[];
  return shifts;
}

const childrenCountLabel = 'Liczba dzieci zarejestrowanych';

const parseMonthInfoFromSchedule = (schedule: Array<Object>, month: MonthModel): MonthInfoModel => {
  let childrenCountRow = schedule.find(row => row[0] === childrenCountLabel) as Object;
  let childrenCount =  Object.values(childrenCountRow).slice(1,month.day_count + 1) ;
  return {
    children_number: childrenCount as number[],
  } 
}

//#endregion
