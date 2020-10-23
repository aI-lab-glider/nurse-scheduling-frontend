import { Dispatch } from "redux";
import { DataRowHelper } from "../../helpers/data-row.helper";
import { groupShiftsByWorkerType } from "../../helpers/shifts.helper";
import { StringHelper } from "../../helpers/string.helper";
import { ActionModel } from "../../state/models/action.model";
import { WorkerType } from "../../state/models/schedule-data/worker-info.model";
import { ScheduleDataModel } from "../../state/models/schedule-data/schedule-data.model";
import { ScheduleDataActionType } from "../../state/reducers/schedule-data.reducer";
import { ChildrenSectionKey } from "../models/children-section.model";
import { ExtraWorkersSectionKey } from "../models/extra-workers-section.model";
import { Schedule, ScheduleProvider } from "../schedule-provider";
import { ChildrenInfoLogic } from "./children-info.logic";
import { DataRow } from "./data-row";
import { ExtraWorkersLogic } from "./extra-workers.logic";
import { MetadataLogic } from "./metadata.logic";
import { SectionLogic } from "./section-logic.model";
import { ShiftsInfoLogic } from "./shifts-info.logic";

export class ScheduleLogic implements ScheduleProvider {
  private providers: SectionLogic[];
  nurseInfoProvider: ShiftsInfoLogic;
  babysitterInfoProvider: ShiftsInfoLogic;
  childrenInfoProvider: ChildrenInfoLogic;
  readonly metadataProvider?: MetadataLogic;
  extraWorkersInfoProvider: ExtraWorkersLogic;

  readonly schedule: Schedule;

  constructor(
    scheduleModel: ScheduleDataModel,
    private dispatchScheduleUpdate: Dispatch<ActionModel<ScheduleDataModel>>
  ) {
    const {
      [WorkerType.NURSE]: nurseShifts,
      [WorkerType.OTHER]: babysitterShifts,
    } = groupShiftsByWorkerType(
      scheduleModel.shifts || {},
      scheduleModel.employee_info?.type || {}
    );

    this.nurseInfoProvider = new ShiftsInfoLogic(nurseShifts || {}, WorkerType.NURSE);

    this.babysitterInfoProvider = new ShiftsInfoLogic(babysitterShifts || {}, WorkerType.OTHER);

    this.childrenInfoProvider = new ChildrenInfoLogic({
      [ChildrenSectionKey.RegisteredChildrenCount]: scheduleModel.month_info?.children_number || [],
    });
    this.extraWorkersInfoProvider = new ExtraWorkersLogic({
      [ExtraWorkersSectionKey.ExtraWorkersCount]: scheduleModel.month_info?.extra_workers || [],
    });
    this.providers = [
      this.nurseInfoProvider,
      this.babysitterInfoProvider,
      this.childrenInfoProvider,
      this.extraWorkersInfoProvider,
    ];
    // not include metadata
    this.metadataProvider =
      scheduleModel.schedule_info &&
      scheduleModel.month_info &&
      new MetadataLogic(
        scheduleModel.schedule_info.year.toString(),
        scheduleModel.schedule_info.month_number,
        scheduleModel.month_info.dates,
        scheduleModel.schedule_info.daysFromPreviousMonthExists
      );

    this.schedule = new Schedule(this);
  }

  public changeShiftFrozenState(
    rowind: number,
    shiftIndex: number,
    updateLocalState: (updatedShifts: [number, number][]) => void
  ): void {
    if (!this.metadataProvider) return;
    const updatedShifts = this.metadataProvider.changeShiftFrozenState(rowind, shiftIndex);
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
    const newDataRow = this.providers
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
    this.extraWorkersInfoProvider = new ExtraWorkersLogic({ ...data });
  }

  public addWorker(
    sectionKey: string,
    newWorkerRow: DataRow,
    workerWorkTime: number,
    updateLocalState: (dataRow: DataRow[]) => void
  ): void {
    const shiftsProvider = [this.nurseInfoProvider, this.babysitterInfoProvider];
    const newSectionContent = shiftsProvider
      ?.find((provider) => provider.sectionKey === sectionKey)
      ?.addWorker(newWorkerRow, workerWorkTime);
    if (newSectionContent) {
      updateLocalState(newSectionContent);
      this.updateGlobalState();
    }
  }

  public addRow(
    sectionKey: string,
    newRow: DataRow,
    updateLocalState: (dataRow: DataRow[]) => void
  ): void {
    const newSectionContent = this.providers
      ?.find((provider) => provider.sectionKey === sectionKey)
      ?.addDataRow(newRow);
    if (newSectionContent) {
      updateLocalState(newSectionContent);
      this.updateGlobalState();
    }
  }
  public getProvider(providerKey: string): SectionLogic | undefined {
    return this.providers.find((provider) => provider.sectionKey === providerKey);
  }
}
