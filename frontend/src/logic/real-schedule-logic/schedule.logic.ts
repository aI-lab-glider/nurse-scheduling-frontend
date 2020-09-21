import { DataRowHelper } from "../../helpers/row.helper";
import { StringHelper } from "../../helpers/string.helper";
import { WorkerType } from "../../state/models/schedule-data/employee-info.model";
import { ScheduleDataModel } from "../../state/models/schedule-data/schedule-data.model";
import { ChildrenInfoLogic } from "./children-info.logic";
import { DataRow } from "./data-row";
import { MetadataLogic } from "./metadata.logic";
import { ShiftsInfoLogic } from "./shifts-info.logic";

interface ScheduleSections {
  nurseInfo: ShiftsInfoLogic,
  babysitterInfo: ShiftsInfoLogic,
  childrenInfo: ChildrenInfoLogic
}

export class ScheduleLogic {
  private sections: ScheduleSections;

  private metadata?: MetadataLogic;

  constructor(scheduleModel: ScheduleDataModel) {
    const [nurseShifts, babysitterShifts] = this.parseShiftsBasedOnEmployeeType(scheduleModel);

    this.sections = {
      nurseInfo: new ShiftsInfoLogic(nurseShifts || {}),

      babysitterInfo: new ShiftsInfoLogic(babysitterShifts || {}),

      childrenInfo: new ChildrenInfoLogic({
        "liczba dzieci zarejestrowanych": scheduleModel.month_info?.children_number || [],
      }),
    };

    this.metadata =
      scheduleModel.schedule_info &&
      new MetadataLogic(
        scheduleModel.schedule_info.year.toString(),
        scheduleModel.schedule_info.month_number
      );
  }

  private parseShiftsBasedOnEmployeeType(scheduleModel: ScheduleDataModel) {
    let nursesShifts = {};
    let babysitterShifts = {};
    if (scheduleModel.shifts) {
      let { nurseCount, babysitterCount } = scheduleModel.employee_info || {
        nurseCount: 0,
        babysitterCount: 0,
      };
      nursesShifts = Object.fromEntries(Object.entries(scheduleModel.shifts).slice(0, nurseCount));
      babysitterShifts = Object.fromEntries(
        Object.entries(scheduleModel.shifts).slice(nurseCount, nurseCount + babysitterCount)
      );
    }
    return [nursesShifts, babysitterShifts];
    // scheduleModel.
  }

  public getScheduleDataModel(): ScheduleDataModel {
    return {
      schedule_info: {
        month_number: this.metadata?.monthNumber,
        year: this.metadata?.year || 0,
      },
      shifts: {
        ...this.sections.nurseInfo.getWorkerShifts(),
        ...this.sections.babysitterInfo.getWorkerShifts(),
      },
      month_info: {
        blocked_days: this.metadata?.blockedDates || [],
        children_number: this.sections.childrenInfo.registeredChildrenNumber,
      },
      employee_info: {
        type: this.getWorkerTypes(),
        babysitterCount: this.sections.babysitterInfo.workersCount || 0,
        nurseCount: this.sections.nurseInfo.workersCount || 0,
      },
    };
  }

  private getWorkerTypes() {
    let result = {};
    this.sections.babysitterInfo.getWorkers().forEach((babysitter) => {
      result[babysitter] = WorkerType.OTHER;
    });
    this.sections.nurseInfo.getWorkers().forEach((nurse) => {
      result[nurse] = WorkerType.NURSE;
    });

    return result;
  }

  public getNurseInfo(): ShiftsInfoLogic {
    if (!this.sections.nurseInfo) {
      throw Error("no nurses");
    }
    return this.sections.nurseInfo;
  }

  public getBabySitterInfo(): ShiftsInfoLogic {
    if (!this.sections.babysitterInfo) {
      throw Error("no babysitter");
    }
    return this.sections.babysitterInfo;
  }

  public getChildrenInfo(): ChildrenInfoLogic {
    if (!this.sections.childrenInfo) {
      throw Error("no children info");
    }
    return this.sections.childrenInfo;
  }

  public getMetadata(): MetadataLogic {
    if (!this.metadata) {
      throw Error("no metadata");
    }
    return this.metadata;
  }

  public findRowByKey(schedule, key: string): [DataRow | undefined, number] {
    let index = schedule.findIndex(
      (row) =>
        !row.isEmpty && StringHelper.getRawValue(row.rowKey) === StringHelper.getRawValue(key)
    );
    let data = schedule[index];
    return [data, index];
  }

  public updateRow(row: DataRow) {
    Object.values(this.sections).forEach((section) => {
      section && section.tryUpdate(row);
    });
  }

  public updateSection(section: keyof ScheduleSections, newSectionData: DataRow[]) {
    // Refactor
    let data = DataRowHelper.dataRowsAsValueDict<any>(newSectionData, true);
    if (section === "childrenInfo") {
      this.sections.childrenInfo = new ChildrenInfoLogic({ ...data });
    } else {
      this.sections[section] = new ShiftsInfoLogic({ ...data });
    }
  }
}
