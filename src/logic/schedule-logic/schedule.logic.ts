import { Dispatch } from "redux";
import { DataRowHelper } from "../../helpers/data-row.helper";
import { ShiftHelper } from "../../helpers/shifts.helper";
import { StringHelper } from "../../helpers/string.helper";
import { ActionModel } from "../../state/models/action.model";
import { WorkerType } from "../../common-models/worker-info.model";
import { ScheduleDataModel } from "../../common-models/schedule-data.model";
import { ScheduleDataActionType } from "../../state/reducers/schedule-data.reducer";
import { Schedule, ScheduleProvider, Sections } from "../providers/schedule-provider.model";
import { ChildrenInfoLogic } from "./children-info.logic";
import { DataRow } from "./data-row";
import { ExtraWorkersLogic } from "./extra-workers.logic";
import { MetadataLogic } from "./metadata.logic";
import { ShiftsInfoLogic } from "./shifts-info.logic";
import { ChildrenSectionKey, ExtraWorkersSectionKey } from "../section.model";

export class ScheduleLogic implements ScheduleProvider {
  readonly schedule: Schedule;
  readonly sections: Sections;

  constructor(
    scheduleModel: ScheduleDataModel,
    private dispatchScheduleUpdate: Dispatch<ActionModel<ScheduleDataModel>>
  ) {
    this.sections = this.createSections(scheduleModel);
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
    const scheduleInfo = scheduleModel.schedule_info;
    return {
      BabysitterInfo: new ShiftsInfoLogic(babysitterShifts, WorkerType.OTHER),
      NurseInfo: new ShiftsInfoLogic(nurseShifts, WorkerType.NURSE),
      ChildrenInfo: new ChildrenInfoLogic(childrenSectionData),
      Metadata: new MetadataLogic(
        scheduleInfo?.year.toString(),
        scheduleInfo?.month_number,
        scheduleModel.month_info?.dates,
        scheduleInfo?.daysFromPreviousMonthExists
      ),
      ExtraWorkersInfo: new ExtraWorkersLogic(extraWorkerSectionData),
    };
  }

  public changeShiftFrozenState(
    rowind: number,
    shiftIndex: number,
    updateLocalState: (updatedShifts: [number, number][]) => void
  ): void {
    if (!this.sections.Metadata) return;
    const updatedShifts = this.sections.Metadata.changeShiftFrozenState(rowind, shiftIndex);
    updateLocalState && updateLocalState(updatedShifts);
    this.updateGlobalState();
  }

  private updateGlobalState(): void {
    const model = this.schedule.getDataModel();
    this.dispatchScheduleUpdate({
      type: ScheduleDataActionType.UPDATE,
      payload: model,
    });
  }

  getWorkerTypes(): {} {
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
    newValue: string,
    updateLocalState: (dataRow: DataRow) => void
  ): void {
    const newDataRow = Object.values(this.sections)
      ?.find((provider) => provider.sectionKey === sectionKey)
      ?.updateDataRow(rowIndex, updateIndexes, newValue);
    if (newDataRow) {
      updateLocalState(newDataRow);
      this.updateGlobalState();
    }
  }

  public updateExtraWorkersSection(newSectionData: DataRow[]): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = DataRowHelper.dataRowsAsValueDict<any>(newSectionData, true);
    this.sections.ExtraWorkersInfo = new ExtraWorkersLogic({ ...data });
  }

  public addWorker(
    sectionKey: keyof Sections,
    newWorkerRow: DataRow,
    workerWorkTime: number,
    updateLocalState: (dataRow: DataRow[]) => void
  ): void {
    const newSectionContent = Object.values(this.sections)
      ?.find((provider) => provider.sectionKey === sectionKey)
      ?.addWorker(newWorkerRow, workerWorkTime);
    if (newSectionContent) {
      updateLocalState(newSectionContent);
      this.updateGlobalState();
    }
  }

  public addRow(
    sectionKey: keyof Sections,
    newRow: DataRow,
    updateLocalState: (dataRow: DataRow[]) => void
  ): void {
    const newSectionContent = Object.values(this.sections)
      ?.find((provider) => provider.sectionKey === sectionKey)
      ?.addDataRow(newRow);
    if (newSectionContent) {
      updateLocalState(newSectionContent);
      this.updateGlobalState();
    }
  }

  public getSection<T>(sectionKey: keyof Sections): T | undefined {
    return Object.values(this.sections).find((provider) => provider.sectionKey === sectionKey);
  }
}
