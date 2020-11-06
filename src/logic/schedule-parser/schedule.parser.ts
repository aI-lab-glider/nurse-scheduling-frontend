import { StringHelper } from "../../helpers/string.helper";
import { WorkerType } from "../../common-models/worker-info.model";
import { ChildrenInfoParser } from "./children-info.parser";
import { DataRowParser } from "./data-row.parser";
import { MetaDataParser } from "./metadata.parser";
import { ShiftsInfoParser } from "./shifts-info.parser";
import { ScheduleProvider, Schedule, Sections } from "../providers/schedule-provider.model";
import { ExtraWorkersParser } from "./extra-workers.parser";
import { MetaDataRowLabel } from "../section.model";

export class ScheduleParser implements ScheduleProvider {
  readonly sections: Sections;
  readonly schedule: Schedule;

  constructor(rawSchedule: string[][]) {
    this.sections = this.parseSections(rawSchedule);
    this.schedule = new Schedule(this);
  }

  private parseSections(rawSchedule: string[][]): Sections {
    const parsers: DataRowParser[] = rawSchedule.map((i) => new DataRowParser(i));
    const [metadataProvider, sectionParsers] = this.initMetadataAndCleanUp(parsers);
    const sections = this.groupParsersBySections(sectionParsers, metadataProvider);
    const extraWorkersInfoProvider = new ExtraWorkersParser(metadataProvider.dayCount);
    return {
      ...sections,
      Metadata: metadataProvider,
      ExtraWorkersInfo: extraWorkersInfoProvider,
    };
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

  getWorkerTypes(): { [key: string]: WorkerType } {
    const result = {};
    Object.keys(this.sections.BabysitterInfo.workerShifts).forEach((babysitter) => {
      result[babysitter] = WorkerType.OTHER;
    });
    Object.keys(this.sections.NurseInfo.workerShifts).forEach((nurse) => {
      result[nurse] = WorkerType.NURSE;
    });

    return result;
  }
  private initMetadataAndCleanUp(rowParsers: DataRowParser[]): [MetaDataParser, DataRowParser[]] {
    const [dataRow, start] = this.findRowByKey(rowParsers, MetaDataRowLabel);
    if (!dataRow) {
      throw new Error("No metadata provided");
    }
    // + 1, because in first row goes metadata
    const daysRow = rowParsers[start + 1];
    const notSectionsRowsCountFromBeginning = 3;
    rowParsers = rowParsers.slice(start + notSectionsRowsCountFromBeginning);
    return [new MetaDataParser(dataRow, daysRow), rowParsers];
  }

  private groupParsersBySections(
    schedule: DataRowParser[],
    metaData: MetaDataParser
  ): Omit<Sections, "Metadata" | "ExtraWorkersInfo"> {
    const childrenSectionData = this.findChildrenSection(schedule);
    const [nurseSectionData, nurseEndIdx] = this.findShiftSection(schedule);
    const [babysitterData] = this.findShiftSection(schedule.slice(nurseEndIdx + 1));

    return {
      ChildrenInfo: new ChildrenInfoParser(childrenSectionData, metaData),
      NurseInfo: new ShiftsInfoParser(nurseSectionData, metaData),
      BabysitterInfo: new ShiftsInfoParser(babysitterData, metaData),
    };
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
