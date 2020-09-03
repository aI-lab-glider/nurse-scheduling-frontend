import { useEffect, useState } from "react";
import XLSXParser from "xlsx";
import { ScheduleDataModel } from "../../../../state/models";
import { EmployeeRole } from "../../../../state/models/schedule-data/employee-info.model";
import { MonthInfoModel } from "../../../../state/models/schedule-data/month-info.model";
import { Shift, ShiftInfoModel } from "../../../../state/models/schedule-data/shift-info.model";
import { useFileReader } from "./useFileReader";

interface MonthModel {
  day_count: number;
}

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

    let month = { day_count: 31 };
    let workbook = XLSXParser.read(fileContent, { type: "array" });

    // here we receive an array of rows, with valuse
    let schedule = (XLSXParser.utils.sheet_to_json(Object.values(workbook.Sheets)[0], {
      defval: null,
      header: 1,
    }) as Array<object>).slice(0, 40);
    let metadata = parseMetadata(schedule);
    return {
      shifts: parseShiftsFromSchedule(schedule, month),
      month_info: parseMonthInfoFromSchedule(schedule, month),
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
  let shifts: ShiftInfoModel = {};
  schedule.forEach((row) => {
    if (isRowContainsEmployeeInfo(row)) {
      let employee = row[0];
      shifts[employee] = getShiftsFromRow(row, month);
    }
  });
  return shifts;
};

const isRowContainsEmployeeInfo = (row: Object) => {
  let rowCode = row[0] && typeof row[0] == "string" && row[0].toLowerCase();
  return (
    (rowCode && rowCode.includes(EmployeeRole.BABYSITTER)) ||
    (rowCode && rowCode.includes(EmployeeRole.NURSE))
  );
};

const getShiftsFromRow = (row, month: MonthModel): Shift[] => {
  // TODO replace 31 with number of days in month

  let shifts: Shift[] = fillShiftsRow(Object.values(row).slice(1, month.day_count + 1) as string[]);
  return shifts;
};

const fillShiftsRow = (row: string[]): Shift[] => {
  let previousShift: Shift = null;
  return row.map((i) => {
    if (i === null) {
      return previousShift;
    }
    switch (i.trim().slice(0, 2).trim()) {
      case "L4":
        previousShift = "L4";
        break;
      case "U":
        previousShift = "U";
        break;
      default:
        previousShift = null;
        break;
    }
    return previousShift || (i.trim().slice(0, 2).trim() as Shift);
  });
};

const parseMonthInfoFromSchedule = (schedule: Array<Object>, month: MonthModel): MonthInfoModel => {
  const childrenCountLabel = "Liczba dzieci zarejestrowanych";
  let childrenCountRow = schedule.find((row) =>
    areEquivalent(row[0], childrenCountLabel)
  ) as Object;
  let childrenCount = Object.values(childrenCountRow).slice(1, month.day_count + 1);
  return {
    children_number: childrenCount as number[],
  };
};

const parseMetadata = (schedule: Array<Object>) => {
  const metaDataKey = "Grafik";
  const keys = ["miesiąc", "rok", "ilość godz"];

  const metaData = {};
  for (let row of schedule) {
    let reducedRow: string[] = Object.values(row).filter((cell) => cell);
    if (areEquivalent(reducedRow[0], metaDataKey)) {
      keys.forEach((key) => {
        let value = reducedRow.find((cell) => includesEquivalent(cell, key))?.toLocaleLowerCase();
        metaData[key] = value?.replace(key, "").trim();
      });
      console.log(metaData);
      return metaData;
    }
  }
};

const includesEquivalent = (string1: string, substring: string) => {
  return string1.toLowerCase().includes(substring.toLocaleLowerCase());
};
const areEquivalent = (string1: string, string2: string) => {
  return (
    string1 && string2 && string1.toLocaleLowerCase().trim() == string2.toLocaleLowerCase().trim()
  );
};
//#endregion
