import { StringHelper } from "../../helpers/string.helper";
import { WorkerType } from "../../common-models/worker-info.model";
import { ChildrenInfoParser } from "./children-info.parser";
import { DataRowParser } from "./data-row.parser";
import { MetaDataParser } from "./metadata.parser";
import { ShiftsInfoParser } from "./shifts-info.parser";
import { Schedule, ScheduleProvider, Sections } from "../providers/schedule-provider.model";
import { ExtraWorkersParser } from "./extra-workers.parser";
import { ChildrenSectionKey, MetaDataRowLabel, MetaDataSectionKey } from "../section.model";

export enum MONTHS {
  STYCZEN = "styczeń",
  LUTY = "luty",
  MARZEC = "marzec",
  KWIECIEN = "kwiecień",
  MAJ = "maj",
  CZERWIEC = "czerwiec",
  LIPIEC = "lipiec",
  SIERPIEN = "sierpień",
  WRZESIEN = "wrzesień",
  PAZDZIERNIK = "październik",
  LISTOPAD = "listopad",
  GRUDZIEN = "grudzień",
}

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
      throw new Error("INVALID_METADATA");
    }

    if (dataRow.rowData().length === 4) {
      throw new Error("INVALID_METADATA");
    }

    const monthTimeRegx = new RegExp(
      MetaDataSectionKey.Month + " [" + Object.values(MONTHS).join("|") + "]"
    );

    if (!monthTimeRegx.test(dataRow.rowData()[0])) {
      throw new Error("INVALID_METADATA");
    }

    const yearTimeRegx = new RegExp(MetaDataSectionKey.Year + " [0-9]{4}");

    if (!yearTimeRegx.test(dataRow.rowData()[1])) {
      throw new Error("INVALID_METADATA");
    }

    const workersTimeRegx = new RegExp(
      MetaDataSectionKey.RequiredavailableWorkersWorkTime + " [0-9]+"
    );

    if (!workersTimeRegx.test(dataRow.rowData()[2])) {
      throw new Error("INVALID_METADATA");
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

    if (nurseSectionData.length === 0) {
      throw new Error("NO_NURSE_SECTION");
    }

    const [babysitterData] = this.findShiftSection(schedule.slice(nurseEndIdx + 1));

    if (babysitterData.length === 0) {
      throw new Error("NO_CARETAKER_SECTION");
    }

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
      return [sectionData, 0];
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

    const children = rowParsers.slice(start, end);

    if (children.length === 0) {
      throw new Error("NO_CHILDREN_SECTION");
    }

    if (!children[0].includes(ChildrenSectionKey.RegisteredChildrenCount)) {
      throw new Error("NO_CHILDREN_SECTION");
    }

    if (children[0].rowData().length === 0) {
      throw new Error("NO_CHILDREN_QUANTITY");
    }

    return children;
  }
}
