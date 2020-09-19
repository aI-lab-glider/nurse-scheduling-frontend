import { DataRow } from "./data-row";
import { SectionLogic } from "./section-logic.model";

export class ChildrenInfoLogic implements SectionLogic {
  private childrenInfoAsDataRows: { [key: string]: DataRow } = {};

  constructor(private childrenInfo: { [key: string]: number[] }) {
    Object.keys(childrenInfo).forEach((key) => {
      this.childrenInfoAsDataRows[key] = new DataRow(key, childrenInfo[key]);
    });
  }

  public get data() {
    return Object.values(this.childrenInfoAsDataRows);
  }

  public get sectionData() {
    return this.data;
  }

  public get registeredChildrenNumber() {
    // TODO refactor
    return this.childrenInfoAsDataRows["liczba dzieci zarejestrowanych"]
      .rowData(true, false)
      .map((i) => parseInt(i));
  }

  public tryUpdate(row: DataRow) {
    if (Object.keys(this.childrenInfoAsDataRows).includes(row.rowKey)) {
      this.childrenInfoAsDataRows[row.rowKey] = row;
      return true;
    }
    return false;
  }
}
