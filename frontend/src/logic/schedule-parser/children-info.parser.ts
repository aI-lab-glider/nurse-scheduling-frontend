import { DataRowParser } from "./data-row.parser";
import { MetaDataParser } from "./metadata.parser";
import { ChildrenInfoProvider } from "../schedule-provider";

export class ChildrenInfoParser implements ChildrenInfoProvider {
  //#region translations
  // TODO refactor
  private traslations = {
    "liczba dzieci zarejestrowanych": "registeredChildrenCount",
    "liczba dzieci hospitalizowanych": "hospitalizedChildrenCount",
    "liczba dzieci urlopowanych": "vacationersChildrenCount",
    "liczba dzieci konsultowanych": "consultedChildrenCount",
  };
  //#endregion

  //#region members
  private childrenData: { [key: string]: number[] };
  private rowByKeys: { [key: string]: DataRowParser } = {};
  //#endregion

  constructor(childrenInfoSection: DataRowParser[], metaData: MetaDataParser) {
    let data = childrenInfoSection.map((row) => {
      row.cropData(metaData.validaDataStart, metaData.validaDataEnd + 1);
      return row;
    });
    data.forEach((row) => {
      this.rowByKeys[row.rowKey] = row;
    });
    this.childrenData = this.parseInfoSection(this.sectionData, metaData);
  }

  public get registeredChildrenNumber() {
    // TODO refactor
    return this.rowByKeys["liczba dzieci zarejestrowanych"]
      .rowData(true, false)
      .map((i) => parseInt(i));
  }

  public get sectionData() {
    return Object.values(this.rowByKeys);
  }

  //#region parser
  private parseInfoSection(
    childrenInfoSection: DataRowParser[],
    metaData: MetaDataParser
  ): { [key: string]: number[] } {
    return childrenInfoSection.reduce((storage, row) => {
      storage[this.traslations[row.rowKey]] = row.rowData(true, false);
      return storage;
    }, {});
  }
  //#endregion
}
