import { StringHelper } from "../../helpers/string.helper";
import { WorkerType } from "../../state/models/schedule-data/employee-info.model";
import { ChildrenInfoParser } from "./children-info.parser";
import { DataRowParser } from "./data-row.parser";
import { MetaDataParser } from "./metadata.parser";
import { ShiftsInfoParser } from "./shifts-info.parser";
import { ScheduleProvider, Schedule } from "../schedule-provider";

export class ScheduleParser implements ScheduleProvider {
  //#region members
  readonly nurseInfoProvider: ShiftsInfoParser;
  readonly babysitterInfoProvider: ShiftsInfoParser;
  readonly childrenInfoProvider: ChildrenInfoParser;
  readonly metadataProvider: MetaDataParser;

  readonly schedule: Schedule;

  constructor(schedule: Array<Object>) {
    schedule = schedule.map((i) => new DataRowParser(i));
    [this.metadataProvider, schedule] = this.initMetadataAndCleanUp(schedule as DataRowParser[]);
    [
      this.childrenInfoProvider,
      this.nurseInfoProvider,
      this.babysitterInfoProvider,
    ] = this.initSections(schedule as DataRowParser[], this.metadataProvider);
    this.schedule = new Schedule(this);
  }

  //#endregion

  public findRowByKey(schedule, key: string): [DataRowParser | undefined, number] {
    let index = schedule.findIndex(
      (row) =>
        !row.isEmpty && StringHelper.getRawValue(row.rowKey) === StringHelper.getRawValue(key)
    );
    let data = schedule[index];
    return [data, index];
  }

  getWorkerTypes() {
    let result = {};
    Object.keys(this.babysitterInfoProvider.getWorkerShifts()).forEach((babysitter) => {
      result[babysitter] = WorkerType.OTHER;
    });
    Object.keys(this.nurseInfoProvider.getWorkerShifts()).forEach((nurse) => {
      result[nurse] = WorkerType.NURSE;
    });

    return result;
  }

  //#endregion

  //#region parser
  private initMetadataAndCleanUp(schedule: DataRowParser[]): [MetaDataParser, DataRowParser[]] {
    let metaDataKey = "Grafik";
    let [dataRow, start] = this.findRowByKey(schedule, metaDataKey);
    if (!dataRow) {
      throw new Error("No metadata provided");
    }
    // Assumption made, that days always go after metadata
    let daysRow = schedule[start + 1];
    let notSectionsRowsCountFromBeginning = 3;
    schedule = schedule.slice(start + notSectionsRowsCountFromBeginning);
    return [new MetaDataParser(dataRow, daysRow), schedule];
  }

  private initSections(
    schedule: DataRowParser[],
    metaData: MetaDataParser
  ): [ChildrenInfoParser, ShiftsInfoParser, ShiftsInfoParser] {
    const childrenSectionData = this.findChildrenSection(schedule);
    const [nurseSectionData, nurseEndIdx] = this.findShiftSection(schedule);
    const [babysitterData] = this.findShiftSection(schedule.slice(nurseEndIdx + 1));

    return [
      new ChildrenInfoParser(childrenSectionData, metaData),
      new ShiftsInfoParser(nurseSectionData, metaData),
      new ShiftsInfoParser(babysitterData, metaData),
    ];
  }

  //#endregion

  //#region find shift section logic
  private findShiftSection(rawData: DataRowParser[]): [DataRowParser[], number] {
    const sectionData: DataRowParser[] = [];

    let sectionDataIdx = rawData.findIndex((rawData) => rawData.isShiftRow);
    if (sectionDataIdx === -1) {
      throw new Error("Cannot find section beginning");
    }
    while (rawData[sectionDataIdx].isShiftRow) {
      sectionData.push(rawData[sectionDataIdx]);
      sectionDataIdx++;
    }
    const dataEndIdx = sectionDataIdx;
    return [sectionData, dataEndIdx];
  }

  //#endregion

  //#region find children section
  private findChildrenSection(schedule: DataRowParser[]): DataRowParser[] {
    let start = schedule.findIndex((r) => !r.isEmpty);
    let end = schedule.findIndex((r, index) => index > start && r.isEmpty);
    return schedule.slice(start, end);
  }

  //#endregion
}
