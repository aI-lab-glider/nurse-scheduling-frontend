import { BaseSectionLogic } from "./section-logic.model";
import { DataRow } from "./data-row";
import { ExtraWorkersInfoProvider } from "../schedule-provider";
import { ExtraWorkersSectionKey } from "../models/extra-workers-section.model";

export class ExtraWorkersLogic extends BaseSectionLogic implements ExtraWorkersInfoProvider {
  private extraWorkersInfoAsDataRows: { [key: string]: DataRow } = {};

  constructor(private extraWorkersData: { [key: string]: number[] }) {
    super();
    Object.keys(extraWorkersData).forEach((key) => {
      this.extraWorkersInfoAsDataRows[key] = new DataRow(key, extraWorkersData[key]);
    });
  }
  sectionKey: string = ExtraWorkersLogic.name;

  public get data() {
    return Object.values(this.extraWorkersInfoAsDataRows);
  }

  public get sectionData() {
    return this.data;
  }

  public get extraWorkers() {
    return this.extraWorkersInfoAsDataRows[ExtraWorkersSectionKey.ExtraWorkersCount]
      .rowData(true, false)
      .map((i) => parseInt(i));
  }

  public tryUpdate(row: DataRow) {
    if (Object.keys(this.extraWorkersInfoAsDataRows).includes(row.rowKey)) {
      this.extraWorkersInfoAsDataRows[row.rowKey] = row;
      return true;
    }
    return false;
  }
}
