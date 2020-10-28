import { DataRow } from "../schedule-logic/data-row";
import { ExtraWorkersInfoProvider } from "../schedule-provider";
import { ExtraWorkersSectionKey } from "../section.model";

export class ExtraWorkersParser implements ExtraWorkersInfoProvider {
  private extraWorkersInfoAsDataRows: { [key: string]: DataRow } = {};

  constructor(numberOfDays: number) {
    const extraWorkers = new Array(numberOfDays).fill(0);
    this.extraWorkersInfoAsDataRows = {
      [ExtraWorkersSectionKey.ExtraWorkersCount]: new DataRow(
        ExtraWorkersSectionKey.ExtraWorkersCount,
        extraWorkers
      ),
    };
  }

  public get extraWorkers(): number[] {
    return this.extraWorkersInfoAsDataRows[ExtraWorkersSectionKey.ExtraWorkersCount]
      .rowData(true, false)
      .map((i) => parseInt(i));
  }

  public get sectionData(): DataRow[] {
    return Object.values(this.extraWorkersInfoAsDataRows);
  }
}
