import { Dispatch } from "redux";
import { ShiftHelper } from "../../helpers/shifts.helper";
import { StringHelper } from "../../helpers/string.helper";
import { ActionModel } from "../../state/models/action.model";
import { WorkerType } from "../../common-models/worker-info.model";
import { ScheduleDataModel } from "../../common-models/schedule-data.model";
import { Schedule, ScheduleProvider, Sections } from "../providers/schedule-provider.model";
import { ChildrenInfoLogic } from "./children-info.logic";
import { DataRow } from "./data-row";
import { ExtraWorkersLogic } from "./extra-workers.logic";
import { MetadataLogic } from "./metadata.logic";
import { ShiftsInfoLogic } from "./shifts-info.logic";
import { ChildrenSectionKey, ExtraWorkersSectionKey } from "../section.model";
import { PersistanceStoreProvider } from "../../api/persistance-store.model";
import { ScheduleDataActionType } from "../../state/reducers/schedule-data.reducer";
import { FoundationInfoLogic } from "./foundation-info.logic";
import { FoundationInfoOptions } from "../providers/foundation-info-provider.model";
export class ScheduleLogic implements ScheduleProvider {
  schedule!: Schedule;
  sections!: Sections;

  constructor(
    private dispatchScheduleUpdate: Dispatch<ActionModel<ScheduleDataModel>>,
    private storeProvider: PersistanceStoreProvider,
    scheduleModel: ScheduleDataModel
  ) {
    this.update(scheduleModel);
  }

  public update(schedule: ScheduleDataModel): void {
    this.sections = this.createSections(schedule);
    this.schedule = new Schedule(this);
  }

  public createSections(scheduleModel: ScheduleDataModel): Sections {
    const {
      [WorkerType.NURSE]: nurseShifts,
      [WorkerType.OTHER]: babysitterShifts,
    } = ShiftHelper.groupShiftsByWorkerType(
      scheduleModel.shifts,
      scheduleModel.employee_info?.type
    );
    const childrenSectionData = {
      [ChildrenSectionKey.RegisteredChildrenCount]: scheduleModel.month_info?.children_number || [],
    };
    const extraWorkerSectionData = {
      [ExtraWorkersSectionKey.ExtraWorkersCount]: scheduleModel.month_info?.extra_workers || [],
    };

    const logics: FoundationInfoOptions = {
      BabysitterInfo: new ShiftsInfoLogic(babysitterShifts, WorkerType.OTHER),
      NurseInfo: new ShiftsInfoLogic(nurseShifts, WorkerType.NURSE),
      ExtraWorkersInfo: new ExtraWorkersLogic(extraWorkerSectionData),
      ChildrenInfo: new ChildrenInfoLogic(childrenSectionData),
    };
    const scheduleInfo = scheduleModel.schedule_info;
    const metadata = new MetadataLogic(
      scheduleInfo?.year.toString(),
      scheduleInfo?.month_number,
      scheduleModel.month_info?.dates,
      scheduleInfo?.daysFromPreviousMonthExists
    );
    const foundationLogic = new FoundationInfoLogic(logics);
    return { ...logics, FoundationInfo: foundationLogic, Metadata: metadata };
  }

  public changeShiftFrozenState(rowind: number, shiftIndex: number): void {
    if (!this.sections.Metadata) return;
    this.sections.Metadata.changeShiftFrozenState(rowind, shiftIndex);
    this.updateGlobalState();
  }

  public getWorkerTypes(): {} {
    const result = {};
    this.sections.BabysitterInfo.workers.forEach((babysitter) => {
      result[babysitter] = WorkerType.OTHER;
    });
    this.sections.NurseInfo.workers.forEach((nurse) => {
      result[nurse] = WorkerType.NURSE;
    });
    return result;
  }

  public findRowByKey(schedule, key: string): [DataRow | undefined, number] {
    const index = schedule.findIndex(
      (row: DataRow) =>
        !row.isEmpty && StringHelper.getRawValue(row.rowKey) === StringHelper.getRawValue(key)
    );
    const data = schedule[index];
    return [data, index];
  }

  public updateRow(
    sectionKey: string,
    rowIndex: number,
    updateIndexes: number[],
    newValue: string
  ): void {
    const newDataRow = Object.values(this.sections)
      ?.find((provider) => provider.sectionKey === sectionKey)
      ?.updateDataRow(rowIndex, updateIndexes, newValue);
    if (newDataRow) {
      this.updateGlobalState();
    }
  }

  public addWorker(
    sectionKey: keyof Sections,
    newWorkerRow: DataRow,
    workerWorkTime: number
  ): void {
    const newSectionContent = (Object.values(this.sections)?.find(
      (provider) => provider.sectionKey === sectionKey
    ) as ShiftsInfoLogic)?.addWorker(newWorkerRow, workerWorkTime);
    if (newSectionContent) {
      this.updateGlobalState();
    }
  }

  public addRow(sectionKey: keyof Sections, newRow: DataRow): void {
    const newSectionContent = Object.values(this.sections)
      ?.find((provider) => provider.sectionKey === sectionKey)
      ?.addDataRow(newRow);
    if (newSectionContent) {
      this.updateGlobalState();
    }
  }

  public getSection<T>(sectionKey: keyof Sections): T | undefined {
    return Object.values(this.sections).find((provider) => provider.sectionKey === sectionKey);
  }

  private updateGlobalState(): void {
    const model = this.schedule.getDataModel();
    this.dispatchScheduleUpdate({
      type: ScheduleDataActionType.UPDATE,
      payload: model,
    });
  }
}
