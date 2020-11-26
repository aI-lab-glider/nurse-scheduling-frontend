import { DataRow } from "./data-row";
import { ExtraWorkersSectionKey } from "../section.model";
import { ExtraWorkersInfoProvider } from "../providers/extra-workers-info-provider.model";

export class ExtraWorkersLogic implements ExtraWorkersInfoProvider {
  private extraWorkersInfoAsDataRows: { [key: string]: DataRow } = {};

  constructor(extraWorkersData: { [key: string]: number[] }) {
    Object.keys(extraWorkersData).forEach((key) => {
      this.extraWorkersInfoAsDataRows[key] = new DataRow(key, extraWorkersData[key]);
    });
  }

  public get data(): DataRow[] {
    return Object.values(this.extraWorkersInfoAsDataRows);
  }

  public get sectionData(): DataRow[] {
    return this.data;
  }

  public get extraWorkers(): number[] {
    return this.extraWorkersInfoAsDataRows[ExtraWorkersSectionKey.ExtraWorkersCount]
      .rowData(true, false)
      .map((i) => parseInt(i));
  }

  public tryUpdate(row: DataRow): boolean {
    if (Object.keys(this.extraWorkersInfoAsDataRows).includes(row.rowKey)) {
      this.extraWorkersInfoAsDataRows[row.rowKey] = row;
      return true;
    }
    return false;
  }
}
