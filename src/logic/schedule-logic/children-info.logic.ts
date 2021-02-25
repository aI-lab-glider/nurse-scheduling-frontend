/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { DataRow } from "./data-row";
import { ChildrenSectionKey } from "../section.model";
import { ChildrenInfoProvider } from "../providers/children-info-provider.model";
import { ScheduleError } from "../../common-models/schedule-error.model";

export class ChildrenInfoLogic implements ChildrenInfoProvider {
  private childrenInfoAsDataRows: { [key: string]: DataRow } = {};

  constructor(childrenInfo: { [key: string]: number[] }) {
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

  get errors(): ScheduleError[] {
    return [];
  }
}
