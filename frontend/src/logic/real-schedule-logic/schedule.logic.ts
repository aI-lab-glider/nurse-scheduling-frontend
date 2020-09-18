import { StringHelper } from "../../helpers/string.helper";
import { WorkerType } from "../../state/models/schedule-data/employee-info.model";
import { ScheduleDataModel } from "../../state/models/schedule-data/schedule-data.model";
import { ChildrenInfoLogic } from "./children-info.logic";
import { DataRow } from "./data-row";
import { MetadataLogic } from "./metadata.logic";
import { SectionLogic } from "./section-logic.model";
import { ShiftsInfoLogic } from "./shifts-info.logic";

export class ScheduleLogic {
  private nurseInfo?: ShiftsInfoLogic;
  private babysitterInfo?: ShiftsInfoLogic;
  private childrenInfo?: ChildrenInfoLogic;
  private metadata?: MetadataLogic;
  private sections: (SectionLogic | undefined)[];
  constructor(scheduleModel: ScheduleDataModel) {
    const [nurseShifts, babysitterShifts] = this.parseShiftsBasedOnEmployeeType(scheduleModel);
    this.nurseInfo = scheduleModel.shifts && new ShiftsInfoLogic(nurseShifts);
    this.babysitterInfo = scheduleModel.shifts && new ShiftsInfoLogic(babysitterShifts);
    this.childrenInfo =
      scheduleModel.month_info?.children_number &&
      new ChildrenInfoLogic({
        "liczba dzieci zarejestrowanych": scheduleModel.month_info?.children_number,
      });
    this.metadata =
      scheduleModel.schedule_info &&
      new MetadataLogic(
        scheduleModel.schedule_info.year.toString(),
        scheduleModel.schedule_info.month_number
      );
    this.sections = [this.babysitterInfo, this.childrenInfo, this.nurseInfo];
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
        ...this.nurseInfo?.getWorkerShifts(),
        ...this.babysitterInfo?.getWorkerShifts(),
      },
      month_info: {
        first_day: this.metadata?.dayNumbers[0],
        children_number: this.childrenInfo?.registeredChildrenNumber,
      },
      employee_info: {
        type: this.getWorkerTypes(),
        babysitterCount: this.babysitterInfo?.workersCount || 0,
        nurseCount: this.nurseInfo?.workersCount || 0,
      },
    };
  }

  private getWorkerTypes() {
    let result = {};
    this.babysitterInfo?.getWorkers().forEach((babysitter) => {
      result[babysitter] = WorkerType.OTHER;
    });
    this.nurseInfo?.getWorkers().forEach((nurse) => {
      result[nurse] = WorkerType.NURSE;
    });

    return result;
  }

  public getNurseInfo(): ShiftsInfoLogic {
    if (!this.nurseInfo) {
      throw Error("no nurses");
    }
    return this.nurseInfo;
  }

  public getBabySitterInfo(): ShiftsInfoLogic {
    if (!this.babysitterInfo) {
      throw Error("no nurses");
    }
    return this.babysitterInfo;
  }

  public getChildrenInfo(): ChildrenInfoLogic {
    if (!this.childrenInfo) {
      throw Error("no nurses");
    }
    return this.childrenInfo;
  }

  public getMetadata(): MetadataLogic {
    if (!this.metadata) {
      throw Error("no nurses");
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
    this.sections.forEach((section) => {
      section && section.tryUpdate(row);
    });
  }
}
