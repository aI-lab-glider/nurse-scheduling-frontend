/* eslint-disable @typescript-eslint/camelcase */
/// <reference types="cypress" />
import { ScheduleParser } from "../../../../../src/logic/schedule-parser/schedule.parser";

import { ScheduleDataModel } from "../../../../../src/common-models/schedule-data.model";
import { ShiftCode, ShiftInfoModel } from "../../../../../src/common-models/shift-info.model";
import { WorkersInfoModel, WorkerType } from "../../../../../src/common-models/worker-info.model";
import { data } from "cypress/types/jquery";
import { ArrayHelper } from "../../../../../src/helpers/array.helper";
describe("Schedule parser", () => {
  const emptyRow = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ];

  const nurseSection = [
    ["pielęgniarka 1", "DN", " ", " ", " ", "U", "U", "U", "U", "U", "D"],
    ["pielęgniarka 2", "DN", "DN", "U", "W", "U", "U", "U", "U", "U", "D"],
    ["pielęgniarka 3", "N", " ", "L4", "D", "U", "U", "U", "U", "U", "D"],
    ["pielęgniarka 6", "U", "U", "U", "U", "D", "D", "DN", "L4", "DN", "U"],
    ["pielęgniarka 7", "DN", "L4", "L4", "W", "L4", "L4", "L4", "L4", "L4", "L4"],
  ];

  const babysitterSection = [
    ["opiekunka 2", "L4", "L4", "L4", "L4", "L4", "D", "N", "L4", "L4", "L4"],
    ["opiekunka 8", "L4", "L4", "L4", "L4", "L4", "L4", "L4", "L4", "L4", "D"],
  ];

  const exampleData = [
    ["Grafik ", "miesiąc listopad", "rok 2020", "ilość godz 0"],
    ["Dni miesiąca", "28", "29", "30", "31", "1", "2", "3", "4", "5", "6"],
    emptyRow,
    ["Dzieci", "2", "5", "6", "12", "35", "24", "24", "5", "1", "10"],
    emptyRow,
    ...nurseSection,
    emptyRow,
    ...babysitterSection,
  ];

  const shifts: ShiftInfoModel = {};
  const employee_info: WorkersInfoModel = { type: {}, time: {} };
  nurseSection.forEach((element) => {
    shifts[element[0]] = element.slice(1).map((x) => ShiftCode[x] ?? ShiftCode.W);
    employee_info.type[element[0]] = WorkerType.NURSE;
    employee_info.time[element[0]] = 1;
  });
  babysitterSection.forEach((element) => {
    shifts[element[0]] = element.slice(1).map((x) => ShiftCode[x] ?? ShiftCode.W);
    employee_info.type[element[0]] = WorkerType.OTHER;
    employee_info.time[element[0]] = 1;
  });

  const expectedSchedule: ScheduleDataModel = {
    schedule_info: { month_number: 10, year: 2020, daysFromPreviousMonthExists: true },
    shifts: shifts,
    month_info: {
      frozen_shifts: [],
      children_number: [2, 5, 6, 12, 35, 24, 24, 5, 1, 10],
      dates: [28, 29, 30, 31, 1, 2, 3, 4, 5, 6],
    },
    employee_info: employee_info,
  };

  describe("basic test", () => {
    const scheduleParser = new ScheduleParser(exampleData);
    const dataModel = scheduleParser.schedule.getDataModel();
    it("check if workerType was parsed correctly ", () => {
      for (const [key, value] of Object.entries(dataModel.employee_info.type)) {
        expect(expectedSchedule.employee_info.type[key]).to.equal(value);
      }
    });
    it("length of days must be equal to length of shifts", () => {
      for (const [key, value] of Object.entries(dataModel.shifts)) {
        expect(value.length).to.equal(dataModel.month_info.dates.length);
      }
    });

    it("shifts are not shuffled e.g babysitters shifts are still the same", () => {
      for (const [key, value] of Object.entries(dataModel.shifts)) {
        expect(ArrayHelper.arePrimitiveArraysEqual(value, expectedSchedule.shifts[key])).to.equal(
          true
        );
      }
    });
    it("all babysitter and nurses are in  employee_info ", () => {
      for (const [key, value] of Object.entries(expectedSchedule.employee_info)) {
        expect(dataModel.employee_info[key]);
      }
    });
  });
});
