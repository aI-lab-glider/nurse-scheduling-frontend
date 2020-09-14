import { SectionLogic } from "../../helpers/section.model";
import { DataRow } from "./data-row.logic";
import { MetaDataLogic } from "./metadata.logic";

export class ChildrenInfoLogic implements SectionLogic {
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
  private rowByKeys: { [key: string]: DataRow } = {};
  //#endregion

  constructor(childrenInfoSection: DataRow[], metaData: MetaDataLogic) {
    let data = childrenInfoSection.map((row) => {
      row.cropData(metaData.firsMondayDate, metaData.lastSundayDate + 1);
      return row;
    });
    data.forEach((row) => {
      this.rowByKeys[row.rowKey] = row;
    });
    this.childrenData = this.parseInfoSection(this.data, metaData);
  }
  public get data() {
    return Object.values(this.rowByKeys);
  }

  public get registeredChildrenNumber() {
    // TODO refactor
    return this.rowByKeys["liczba dzieci zarejestrowanych"]
      .rowData(true, false)
      .map((i) => parseInt(i));
  }

  //#region logic
  public get sectionData() {
    return this.data;
  }

  public tryUpdate(row: DataRow) {
    if (Object.keys(this.rowByKeys).includes(row.rowKey)) {
      this.rowByKeys[row.rowKey] = row;
    }
  }
  //#endregion

  //#region parser
  private parseInfoSection(
    childrenInfoSection: DataRow[],
    metaData: MetaDataLogic
  ): { [key: string]: number[] } {
    return childrenInfoSection.reduce((storage, row) => {
      storage[this.traslations[row.rowKey]] = row.rowData(true, false);
      return storage;
    }, {});
  }
  //#endregion
}
