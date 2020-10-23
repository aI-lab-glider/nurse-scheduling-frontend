import { ChildrenSectionKey } from "../models/children-section.model";
import { ChildrenInfoProvider } from "../schedule-provider";
import { DataRow } from "./data-row";
import { BaseSectionLogic } from "./section-logic.model";

export class ChildrenInfoLogic extends BaseSectionLogic implements ChildrenInfoProvider {
  sectionKey = ChildrenInfoLogic.name;
  private childrenInfoAsDataRows: { [key: string]: DataRow } = {};

  constructor(private childrenInfo: { [key: string]: number[] }) {
    super();
    Object.keys(childrenInfo).forEach((key) => {
      this.childrenInfoAsDataRows[key] = new DataRow(key, childrenInfo[key]);
    });
  }

  public get data(): DataRow[] {
    return Object.values(this.childrenInfoAsDataRows);
  }

  public get sectionData(): DataRow[] {
    return this.data;
  }

  public get registeredChildrenNumber(): number[] {
    // TODO refactor
    // In current schedules, there are more then one field, that provides information about children.
    //  Nevertheless, in model used by alghorythm - only one.
    // So this function  (and the model that we send to the backend ) should be reviewed after we will receive new schedules
    return this.childrenInfoAsDataRows[ChildrenSectionKey.RegisteredChildrenCount]
      .rowData(true, false)
      .map((i) => parseInt(i));
  }

  public tryUpdate(row: DataRow): boolean {
    if (Object.keys(this.childrenInfoAsDataRows).includes(row.rowKey)) {
      this.childrenInfoAsDataRows[row.rowKey] = row;
      return true;
    }
    return false;
  }
}
