import { StringHelper } from "../../helpers/string.helper";
import { WorkerType } from "../../state/models/schedule-data/worker-info.model";
import { ChildrenInfoParser } from "./children-info.parser";
import { DataRowParser } from "./data-row.parser";
import { MetaDataParser } from "./metadata.parser";
import { ShiftsInfoParser } from "./shifts-info.parser";
import { ScheduleProvider, Schedule } from "../schedule-provider";
import { ExtraWorkersParser } from "./extra-workers.parser";
import { MetaDataRowLabel } from "../models/metadata-section.model";

export class ScheduleParser implements ScheduleProvider {
  readonly nurseInfoProvider: ShiftsInfoParser;
  readonly babysitterInfoProvider: ShiftsInfoParser;
  readonly childrenInfoProvider: ChildrenInfoParser;
  readonly metadataProvider: MetaDataParser;
  readonly extraWorkersInfoProvider: ExtraWorkersParser;

  readonly schedule: Schedule;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(rawSchedule: string[][]) {
    let rowParsers: DataRowParser[] = rawSchedule.map((i) => new DataRowParser(i));
    [this.metadataProvider, rowParsers] = this.initMetadataAndCleanUp(rowParsers);
    [
      this.childrenInfoProvider,
      this.nurseInfoProvider,
      this.babysitterInfoProvider,
    ] = this.initSections(rowParsers, this.metadataProvider);
    this.extraWorkersInfoProvider = new ExtraWorkersParser(this.metadataProvider.dayCount);
    this.schedule = new Schedule(this);
  }

  public findRowByKey(
    rowParsers: DataRowParser[],
    key: string
  ): [DataRowParser | undefined, number] {
    const index = rowParsers.findIndex(
      (row) =>
        !row.isEmpty && StringHelper.getRawValue(row.rowKey) === StringHelper.getRawValue(key)
    );
    const data = rowParsers[index];
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
  private initMetadataAndCleanUp(rowParsers: DataRowParser[]): [MetaDataParser, DataRowParser[]] {
    const [dataRow, start] = this.findRowByKey(rowParsers, MetaDataRowLabel);
    if (!dataRow) {
      throw new Error("No metadata provided");
    }
    // Assumption made, that days are always go after metadata
    const daysRow = rowParsers[start + 1];
    const notSectionsRowsCountFromBeginning = 3;
    rowParsers = rowParsers.slice(start + notSectionsRowsCountFromBeginning);
    return [new MetaDataParser(dataRow, daysRow), rowParsers];
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

  private findShiftSection(rowParsers: DataRowParser[]): [DataRowParser[], number] {
    const sectionData: DataRowParser[] = [];
    let sectionDataIdx = rowParsers.findIndex((rowParser) => rowParser.isShiftRow);
    if (sectionDataIdx === -1) {
      throw new Error("Cannot find section beginning");
    }
    while (sectionDataIdx < rowParsers.length && rowParsers[sectionDataIdx].isShiftRow) {
      sectionData.push(rowParsers[sectionDataIdx]);
      sectionDataIdx++;
    }
    const dataEndIdx = sectionDataIdx;
    return [sectionData, dataEndIdx];
  }

  private findChildrenSection(rowParsers: DataRowParser[]): DataRowParser[] {
    const start = rowParsers.findIndex((r) => !r.isEmpty);
    const end = rowParsers.findIndex((r, index) => index > start && r.isEmpty);
    return rowParsers.slice(start, end);
  }
}
