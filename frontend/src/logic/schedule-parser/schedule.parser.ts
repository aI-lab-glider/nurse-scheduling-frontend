import { StringHelper } from "../../helpers/string.helper";
import { WorkerType } from "../../common-models/worker-info.model";
import { ChildrenInfoParser } from "./children-info.parser";
import { DataRowParser } from "./data-row.parser";
import { MetaDataParser } from "./metadata.parser";
import { ShiftsInfoParser } from "./shifts-info.parser";
import { ScheduleProvider, Schedule } from "../schedule-provider";
import { ExtraWorkersParser } from "./extra-workers.parser";
import { MetaDataRowLabel } from "../section.model";

export class ScheduleParser implements ScheduleProvider {
  readonly nurseInfoProvider: ShiftsInfoParser;
  readonly babysitterInfoProvider: ShiftsInfoParser;
  readonly childrenInfoProvider: ChildrenInfoParser;
  readonly metadataProvider: MetaDataParser;
  readonly extraWorkersInfoProvider: ExtraWorkersParser;

  readonly schedule: Schedule;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(schedule: Array<Record<string, any>>) {
    schedule = schedule.map((i) => new DataRowParser(i));
    [this.metadataProvider, schedule] = this.initMetadataAndCleanUp(schedule as DataRowParser[]);
    [
      this.childrenInfoProvider,
      this.nurseInfoProvider,
      this.babysitterInfoProvider,
    ] = this.initSections(schedule as DataRowParser[], this.metadataProvider);
    this.extraWorkersInfoProvider = new ExtraWorkersParser(this.metadataProvider.dayCount);
    this.schedule = new Schedule(this);
  }

  public findRowByKey(schedule, key: string): [DataRowParser | undefined, number] {
    const index = schedule.findIndex(
      (row) =>
        !row.isEmpty && StringHelper.getRawValue(row.rowKey) === StringHelper.getRawValue(key)
    );
    const data = schedule[index];
    return [data, index];
  }

  getWorkerTypes(): {} {
    const result = {};
    Object.keys(this.babysitterInfoProvider.getWorkerShifts()).forEach((babysitter) => {
      result[babysitter] = WorkerType.OTHER;
    });
    Object.keys(this.nurseInfoProvider.getWorkerShifts()).forEach((nurse) => {
      result[nurse] = WorkerType.NURSE;
    });

    return result;
  }
  private initMetadataAndCleanUp(schedule: DataRowParser[]): [MetaDataParser, DataRowParser[]] {
    const [dataRow, start] = this.findRowByKey(schedule, MetaDataRowLabel);
    if (!dataRow) {
      throw new Error("No metadata provided");
    }
    // Assumption made, that days are always go after metadata
    const daysRow = schedule[start + 1];
    const notSectionsRowsCountFromBeginning = 3;
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

  private findShiftSection(rawData: DataRowParser[]): [DataRowParser[], number] {
    const sectionData: DataRowParser[] = [];
    let sectionDataIdx = rawData.findIndex((rawData) => rawData.isShiftRow);
    if (sectionDataIdx === -1) {
      throw new Error("Cannot find section beginning");
    }
    while (sectionDataIdx < rawData.length && rawData[sectionDataIdx].isShiftRow) {
      sectionData.push(rawData[sectionDataIdx]);
      sectionDataIdx++;
    }
    const dataEndIdx = sectionDataIdx;
    return [sectionData, dataEndIdx];
  }

  private findChildrenSection(schedule: DataRowParser[]): DataRowParser[] {
    const start = schedule.findIndex((r) => !r.isEmpty);
    const end = schedule.findIndex((r, index) => index > start && r.isEmpty);
    return schedule.slice(start, end);
  }
}
