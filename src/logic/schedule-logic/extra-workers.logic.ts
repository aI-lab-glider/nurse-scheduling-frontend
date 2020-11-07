import { BaseSectionLogic } from "./section-logic.model";
import { DataRow } from "./data-row";
import { Sections } from "../providers/schedule-provider.model";
import { ExtraWorkersSectionKey } from "../section.model";
import { ExtraWorkersInfoProvider } from "../providers/extra-workers-info-provider.model";

export class ExtraWorkersLogic extends BaseSectionLogic implements ExtraWorkersInfoProvider {
  get sectionKey(): keyof Sections {
    return "ExtraWorkersInfo";
  }

  private extraWorkersInfoAsDataRows: { [key: string]: DataRow } = {};

  constructor(private extraWorkersData: { [key: string]: number[] }) {
    super();
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
