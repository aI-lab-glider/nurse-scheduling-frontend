import { DataRowParser } from "./data-row.parser";
import { MetaDataParser } from "./metadata.parser";

export class ChildrenInfoParser {
  //#region translations
  // TODO refactor
  private traslations = {
    "liczba dzieci zarejestrowanych": "registered_children_count",
    "liczba dzieci hospitalizowanych": "hospitalized_children_count",
    "liczba dzieci urlopowanych": "vacationers_children_count",
    "liczba dzieci konsultowanych": "consulted_children_count",
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
