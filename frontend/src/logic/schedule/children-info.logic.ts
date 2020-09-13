import { SectionLogic } from "../../helpers/section.model";
import { DataRow } from "./data-row.logic";
import { MetaDataLogic } from "./metadata.logic";

export class ChildrenInfoLogic implements SectionLogic {
  //#region translations
  private traslations = {
    "liczba dzieci zarejestrowanych": "registered_children_count",
    "liczba dzieci hospitalizowanych": "hospitalized_children_count",
    "liczba dzieci urlopowanych": "vacationers_children_count",
    "liczba dzieci konsultowanych": "consulted_children_count",
  };
  //#endregion

  //#region members
  private data: DataRow[];
  private childrenData: { [key: string]: number[] };
  //#endregion

  constructor(childrenInfoSection: DataRow[], metaData: MetaDataLogic) {
    this.data = childrenInfoSection.map((row) => {
      row.cropData(metaData.firsMondayDate, metaData.lastSundayDate + 1);
      return row;
    });
    this.childrenData = this.parseInfoSection(this.data, metaData);
  }

  public get registeredChildrenNumber() {
    return this.childrenData["registered_children_count"];
  }

  //#region logic
  public get sectionData() {
    return this.data;
  }

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
