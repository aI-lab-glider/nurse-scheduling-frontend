/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { DataRowParser } from "../../../../../src/logic/schedule-parser/data-row.parser";

describe("DataRowParser", () => {
  const dataRow = [" Schedule ", "november", "year 2020", "", "number of hours 10"];
  const firstEmptyDataRow = ["", "november", "year 2020", "", "number of hours 10"];
  const emptyDataRow = ["", "", "", ""];

  describe("get isEmpty", () => {
    context("when is not empty", () => {
      const dataRowParser = new DataRowParser(dataRow);

      it("should return false", () => {
        expect(dataRowParser.isEmpty).to.equal(false);
      });
    });

    context("when is empty", () => {
      const dataRowParser = new DataRowParser(emptyDataRow);

      it("should return true", () => {
        expect(dataRowParser.isEmpty).to.equal(true);
      });
    });
  });

  describe("get rowKey", () => {
    context("when is empty", () => {
      const dataRowParser = new DataRowParser(emptyDataRow);

      it("should throw error", () => {
        expect(() => dataRowParser.rowKey).to.throw("Trying to access key from an empty row");
      });
    });

    context("when is not empty", () => {
      const dataRowParser = new DataRowParser(dataRow);

      it("should return row key", () => {
        expect(dataRowParser.rowKey).to.equal("schedule");
      });
    });

    context("when first value is empty", () => {
      const dataRowParser = new DataRowParser(firstEmptyDataRow);

      it("should return row key (and skip nulls)", () => {
        expect(dataRowParser.rowKey).to.equal("november");
      });
    });
  });

  describe("rowData", () => {
    const dataRowParser = new DataRowParser(dataRow);

    it("should return row data with or without nulls and key based on parameters", () => {
      expect(dataRowParser.rowData()).to.eql(["november", "year 2020", "number of hours 10"]);
      expect(dataRowParser.rowData(true)).to.eql([
        "november",
        "year 2020",
        null,
        "number of hours 10",
      ]);
      expect(dataRowParser.rowData(false, true)).to.eql([
        " Schedule ",
        "november",
        "year 2020",
        "number of hours 10",
      ]);
      expect(dataRowParser.rowData(true, true)).to.eql([
        " Schedule ",
        "november",
        "year 2020",
        null,
        "number of hours 10",
      ]);
    });
  });

  describe("createWithProcessedRow", () => {
    const dataRowParser = new DataRowParser(dataRow);
    const processingFunctionMock = (row: DataRowParser): [string, string, string, string] => {
      return ["alice", "has", "a", "cat"];
    };

    it("should return new DataRowParser with returned value of processing function appended to row key", () => {
      expect(dataRowParser.createWithProcessedRow(processingFunctionMock)).to.be.a("Object");
      expect(
        dataRowParser.createWithProcessedRow(processingFunctionMock).rowData(true, true)
      ).to.eql(["schedule", "alice", "has", "a", "cat"]);
    });
  });

  describe("createWithCroppedData", () => {
    const dataRowParser = new DataRowParser(dataRow);

    it("should return new DataRowParser with cropped data", () => {
      expect(dataRowParser.createWithCroppedData(0, -1).rowData(true, true)).to.eql([
        "schedule",
        "november",
        "year 2020",
        null,
      ]);
      expect(dataRowParser.createWithCroppedData(2, 4).rowData(true, true)).to.eql([
        "schedule",
        null,
        "number of hours 10",
      ]);
    });
  });

  describe("findValue", () => {
    const dataRowParser = new DataRowParser(dataRow);

    it("should return string without a key when finds cell with this key", () => {
      expect(dataRowParser.findValue("nuMBer")).to.eql("of hours 10");
    });

    it("should return empty string when does not find value", () => {
      expect(dataRowParser.findValue("alice")).to.eql("");
    });
  });

  describe("findValues", () => {
    const dataRowParser = new DataRowParser(dataRow);

    it("should return array of strings when finds value in corresponding argument", () => {
      expect(dataRowParser.findValues("nuMBer", "alice")).to.eql(["of hours 10", ""]);
    });
  });
});
