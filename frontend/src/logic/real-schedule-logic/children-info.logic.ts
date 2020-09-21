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
    // In current schedules, there are more thna one field, that provides information about children.
    //  Nevertheless, in model used by alghorythm - only one.
    // So this function  (and the model that we send to the backend ) should be reviewed after we will receive new schedules
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
