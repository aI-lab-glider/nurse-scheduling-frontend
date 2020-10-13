import { DataRowHelper } from "../../helpers/row.helper";
import { StringHelper } from "../../helpers/string.helper";
import { WorkerType } from "../../state/models/schedule-data/employee-info.model";
import { ScheduleDataModel } from "../../state/models/schedule-data/schedule-data.model";
import { ChildrenInfoLogic } from "./children-info.logic";
import { DataRow } from "./data-row";
import { MetadataLogic } from "./metadata.logic";
import { ShiftsInfoLogic } from "./shifts-info.logic";
import { Schedule, ScheduleProvider } from "../schedule-provider";
import { ExtraWorkersLogic } from "./extra-workers.logic";

export class ScheduleLogic implements ScheduleProvider {
  nurseInfoProvider: ShiftsInfoLogic;
  babysitterInfoProvider: ShiftsInfoLogic;
  childrenInfoProvider: ChildrenInfoLogic;
  extraWorkersInfoProvider: ExtraWorkersLogic;

  readonly metadataProvider?: MetadataLogic;

  readonly schedule: Schedule;

  constructor(scheduleModel: ScheduleDataModel) {
    const [nurseShifts, babysitterShifts] = this.parseShiftsBasedOnEmployeeType(scheduleModel);

    this.nurseInfoProvider = new ShiftsInfoLogic(nurseShifts || {});

    this.babysitterInfoProvider = new ShiftsInfoLogic(babysitterShifts || {});

    this.childrenInfoProvider = new ChildrenInfoLogic({
      "liczba dzieci zarejestrowanych": scheduleModel.month_info?.children_number || [],
    });

    this.metadataProvider =
      scheduleModel.schedule_info &&
      scheduleModel.month_info &&
      new MetadataLogic(
        scheduleModel.schedule_info.year.toString(),
        scheduleModel.schedule_info.month_number,
        scheduleModel.month_info.dates,
        scheduleModel.schedule_info.daysFromPreviousMonthExists
      );
    this.extraWorkersInfoProvider = new ExtraWorkersLogic({
      "liczba dodatkowych pracowników": scheduleModel.month_info?.extra_workers || [],
    });
    this.schedule = new Schedule(this);
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
  }

  getWorkerTypes() {
    let result = {};
    this.babysitterInfoProvider.getWorkers().forEach((babysitter) => {
      result[babysitter] = WorkerType.OTHER;
    });
    this.nurseInfoProvider.getWorkers().forEach((nurse) => {
      result[nurse] = WorkerType.NURSE;
    });

    return result;
  }

  public getNurseInfo(): ShiftsInfoLogic {
    if (!this.nurseInfoProvider) {
      throw Error("no nurses");
    }
    return this.nurseInfoProvider;
  }

  public getBabySitterInfo(): ShiftsInfoLogic {
    if (!this.babysitterInfoProvider) {
      throw Error("no babysitter");
    }
    return this.babysitterInfoProvider;
  }

  public getChildrenInfo(): ChildrenInfoLogic {
    if (!this.childrenInfoProvider) {
      throw Error("no children info");
    }
    return this.childrenInfoProvider;
  }

  public getMetadata(): MetadataLogic {
    if (!this.metadataProvider) {
      throw Error("no metadata");
    }
    return this.metadataProvider;
  }

  public getExtraWorkersInfo(): ExtraWorkersLogic {
    if (!this.extraWorkersInfoProvider) {
      throw Error("no extra workers info");
    }
    return this.extraWorkersInfoProvider;
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
    this.nurseInfoProvider.tryUpdate(row);
    this.babysitterInfoProvider.tryUpdate(row);
    this.childrenInfoProvider.tryUpdate(row);
  }

  public updateChildrenSection(newSectionData: DataRow[]) {
    let data = DataRowHelper.dataRowsAsValueDict<any>(newSectionData, true);
    this.childrenInfoProvider = new ChildrenInfoLogic({ ...data });
  }

  public updateNurseSection(newSectionData: DataRow[]) {
    let data = DataRowHelper.dataRowsAsValueDict<any>(newSectionData, true);
    this.nurseInfoProvider = new ShiftsInfoLogic({ ...data });
  }

  public updateBabysitterSection(newSectionData: DataRow[]) {
    let data = DataRowHelper.dataRowsAsValueDict<any>(newSectionData, true);
    this.babysitterInfoProvider = new ShiftsInfoLogic({ ...data });
  }

  public updateExtraWorkersSection(newSectionData: DataRow[]) {
    let data = DataRowHelper.dataRowsAsValueDict<any>(newSectionData, true);
    this.extraWorkersInfoProvider = new ExtraWorkersLogic({ ...data });
  }
}
