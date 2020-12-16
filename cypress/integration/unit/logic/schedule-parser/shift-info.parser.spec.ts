/// <reference types="cypress" />
import { DataRowParser } from "../../../../../src/logic/schedule-parser/data-row.parser";
import { MetaDataParser } from "../../../../../src/logic/schedule-parser/metadata.parser";
import { ShiftsInfoParser } from "../../../../../src/logic/schedule-parser/shifts-info.parser";

//#region  data declaration

const errorsTestCases: { data: DataRowParser[]; errorCount: number }[] = [
  {
    data: [
      new DataRowParser(["opiekunka 1", "N", "Error", "N", " ", "D", "N", "NotValid", "L4", "U"]),
    ],
    errorCount: 2,
  },
  {
    data: [
      new DataRowParser(["opiekunka 1", "N", "Error", "N", " ", "D", "N", "NotValid", "L4", "U"]),
      new DataRowParser(["opiekunka 2", "N", "L4", " ", " ", "L4", "N", " ", "L4", "U"]),
      new DataRowParser(["opiekunka 3", "N", "*", "N", "765 ", "D", "N", "xrd", "L4", "U"]),
    ],
    errorCount: 5,
  },
  {
    data: [new DataRowParser(["opiekunka 1", "N", " ", "N", " ", "D", "N", " ", "L4", "U"])],
    errorCount: 0,
  },
];

const metaData: MetaDataParser = new MetaDataParser(
  new DataRowParser(["Grafik ", "miesiąc listopad", "rok 2020", "ilość godz 0"]),
  new DataRowParser(["Dni miesiąca", "28", "29", "30", "31", "1", "2", "3", "4", "5"])
);

//#region

describe("ShifstInfo parser", () => {
  context("Testing detection of errors", () => {
    errorsTestCases.forEach((element) => {
      const shiftsInfoParser = new ShiftsInfoParser(element.data, metaData);
      const result = shiftsInfoParser.errors;
      it(`should have exaclty ${element.errorCount} errors`, () => {
        expect(result).have.lengthOf(element.errorCount);
      });
    });
  });
});
