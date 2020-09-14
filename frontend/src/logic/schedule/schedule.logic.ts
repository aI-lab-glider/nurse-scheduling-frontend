import { SectionLogic } from "../../helpers/section.model";
import { ScheduleDataModel } from "../../state/models/schedule-data/schedule-data.model";
import { ChildrenInfoLogic } from "./children-info.logic";
import { DataRow } from "./data-row.logic";
import { MetaDataLogic } from "./metadata.logic";
import { ShiftsInfoLogic } from "./shifts-info.logic";

type ScheduleLogicSectionField = {
  rawData?: DataRow[];
  sectionLogic?: SectionLogic;
  initializer: new (rawData: DataRow[], metaData: MetaDataLogic) => SectionLogic;
};

export class ScheduleLogic {
  //#region members
  //#region schedule sections
  private readonly sections: { [key: string]: ScheduleLogicSectionField } = {
    children_info: {
      initializer: ChildrenInfoLogic,
    },
    nurse_info: {
      initializer: ShiftsInfoLogic,
    },
    babysitter_info: {
      initializer: ShiftsInfoLogic,
    },
  };
  //#endregion
  private metaData: MetaDataLogic;
  //#endregion

  //#public methods

  public getNurseInfo(): ShiftsInfoLogic {
    return this.sections["nurse_info"].sectionLogic as ShiftsInfoLogic;
  }

  public getChildrenInfo(): ChildrenInfoLogic {
    return this.sections["children_info"].sectionLogic as ChildrenInfoLogic;
  }

  public getMetadata(): MetaDataLogic {
    return this.metaData;
  }
  public getBabySitterInfo(): ShiftsInfoLogic {
    return this.sections["babysitter_info"].sectionLogic as ShiftsInfoLogic;
  }

  public findRowByKey(schedule, key: string): [DataRow | undefined, number] {
    let index = schedule.findIndex((r) => r.matchesRowKey(key));
    let data = schedule[index];
    return [data, index];
  }

  public updateRow(row: DataRow) {
    Object.values(this.sections)
      .map((s) => s.sectionLogic)
      .forEach((logic) => {
        logic && logic.tryUpdate(row);
      });
  }

  public asDict(): ScheduleDataModel {
    return {
      schedule_info: {
        month_number: this.metaData.monthNumber,
        year: this.metaData.year,
      },
      shifts: {
        ...(this.sections["nurse_info"].sectionLogic as ShiftsInfoLogic).getWorkerShifts(),
        ...(this.sections["babysitter_info"].sectionLogic as ShiftsInfoLogic).getWorkerShifts(),
      },
      month_info: {
        days_of_week: this.metaData.daysOfWeek,
        day_numbers: this.metaData.dayNumbers,
        children_number: (this.sections["children_info"].sectionLogic as ChildrenInfoLogic)
          .registeredChildrenNumber,
      },
      employee_info: {
        babysitterCount: (this.sections["babysitter_info"].sectionLogic as ShiftsInfoLogic)
          .workersCount,
        nurseCount: (this.sections["nurse_info"].sectionLogic as ShiftsInfoLogic).workersCount,
      },
    };
  }
  //#endregion
  //#region initialization
  constructor(schedule: Array<Object>) {
    schedule = schedule.map((i) => new DataRow(i));
    [this.metaData, schedule] = this.initMetadataAndCleanUp(schedule as DataRow[]);
    this.sections = this.initSections(schedule as DataRow[], this.metaData);
  }

  private initSections(rawData: DataRow[], metadata: MetaDataLogic) {
    let sectionsCount = Object.keys(this.sections).length;
    let rawDataBySections = this.cropSections(rawData, sectionsCount);
    let initializedSections = {};
    Object.keys(this.sections).forEach((key, index) => {
      let rawData = rawDataBySections[index];
      let initializer = this.sections[key].initializer;

      initializedSections[key] = {
        rawData: rawData,
        sectionLogic: new initializer(rawData, metadata),
        initializer: initializer,
      } as ScheduleLogicSectionField;
    });

    return initializedSections;
  }

  private initMetadataAndCleanUp(rawData: DataRow[]): [MetaDataLogic, DataRow[]] {
    let metaDataKey = "Grafik";
    let [dataRow, start] = this.findRowByKey(rawData, metaDataKey);
    let notSectionsRowsCountFromBeginning = 3;
    let schedule = rawData.slice(start + notSectionsRowsCountFromBeginning);
    return [new MetaDataLogic(dataRow), schedule];
  }
  //#endregion

  //#region crop logic
  private cropSection(schedule: DataRow[]): [DataRow[], DataRow[]] {
    let start = schedule.findIndex((r) => !r.isEmpty);
    let end = schedule.findIndex((r, index) => index > start && r.isEmpty);
    return [schedule.slice(start, end), schedule.slice(end)];
  }

  private cropSections(schedule: DataRow[], amount: number, offset: number = 0): DataRow[][] {
    let result: DataRow[][] = [];
    for (let i = 0; i < amount; ++i) {
      if (i >= offset) {
        let [section, reduced_schedule] = this.cropSection(schedule);
        schedule = reduced_schedule;
        result.push(section);
      }
    }
    return result;
  }
  //#endregion
}
