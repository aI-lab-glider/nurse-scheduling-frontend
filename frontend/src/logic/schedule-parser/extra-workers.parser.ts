import { DataRow } from "../real-schedule-logic/data-row";
import { ExtraWorkersInfoProvider } from "../schedule-provider";

export class ExtraWorkersParser implements ExtraWorkersInfoProvider {
  private key = "liczba dodatkowych pracowników";
  private extraWorkersInfoAsDataRows: { [key: string]: DataRow } = {};

  constructor(numberOfDays: number) {
    const extraWorkers = new Array(numberOfDays).fill(0);
    this.extraWorkersInfoAsDataRows = { [this.key]: new DataRow(this.key, extraWorkers) };
  }

  public get extraWorkers() {
    return this.extraWorkersInfoAsDataRows[this.key].rowData(true, false).map((i) => parseInt(i));
  }

  public get sectionData() {
    return Object.values(this.extraWorkersInfoAsDataRows);
  }
}
