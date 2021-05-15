import {
  getScheduleKey,
  ScheduleDataModel,
  validateMonthDM,
} from "../../state/schedule-data/schedule-data.model";
import { cropScheduleDMToMonthDM } from "../schedule-container-converter/schedule-container-converter";
import { MonthHelper } from "../../helpers/month.helper";
import { ArrayHelper, ArrayPositionPointer } from "../../helpers/array.helper";
import _ from "lodash";
import { getRevisionTypeFromKey, RevisionKey, RevisionType } from "./persistance-store.model";
import { LocalMonthRevisionManager } from "./month-revision-manager";

export abstract class SchedulePersistProvider {
  abstract saveSchedule(type: RevisionType, scheduleDataModel: ScheduleDataModel): Promise<void>;

  //abstract getSchedule(revisionKey: RevisionKey): Promise<MonthDataModel | undefined>;
}

export class LocalSchedulePersistProvider extends SchedulePersistProvider {
  private localMonthRevisionManager: LocalMonthRevisionManager;

  constructor() {
    super();
    this.localMonthRevisionManager = new LocalMonthRevisionManager();
  }

  async saveSchedule(type: RevisionType, scheduleDataModel: ScheduleDataModel): Promise<void> {
    const monthDataModel = cropScheduleDMToMonthDM(scheduleDataModel);
    await this.localMonthRevisionManager.saveMonthRevision(type, monthDataModel);

    const { daysMissingFromNextMonth } = MonthHelper.calculateMissingFullWeekDays(
      monthDataModel.scheduleKey
    );

    if (daysMissingFromNextMonth !== 0) {
      const nextMonthRevisionKey = getScheduleKey(scheduleDataModel).nextMonthKey.getRevisionKey(
        type
      );
      await this.updateMonthPartBasedOnScheduleDM(
        nextMonthRevisionKey,
        scheduleDataModel,
        daysMissingFromNextMonth,
        "HEAD"
      );
    }
  }

  private async updateMonthPartBasedOnScheduleDM(
    revisionKey: RevisionKey,
    scheduleDataModel: ScheduleDataModel,
    missingDays: number,
    updatePosition: ArrayPositionPointer
  ): Promise<void> {
    try {
      const updatedMonthDataModel = await this.localMonthRevisionManager.getMonthRevision(
        revisionKey
      );
      if (_.isNil(updatedMonthDataModel)) return;

      const newShifts = _.cloneDeep(updatedMonthDataModel.shifts);

      Object.keys(updatedMonthDataModel.shifts).forEach((key) => {
        newShifts[key] =
          _.isNil(scheduleDataModel.shifts[key]) || scheduleDataModel.shifts[key]?.length === 0
            ? updatedMonthDataModel.shifts[key]
            : ArrayHelper.update(
                updatedMonthDataModel.shifts[key],
                updatePosition,
                scheduleDataModel.shifts[key],
                missingDays
              );
      });

      updatedMonthDataModel.shifts = newShifts;
      updatedMonthDataModel.month_info = {
        ...updatedMonthDataModel.month_info,
        children_number: ArrayHelper.update(
          updatedMonthDataModel.month_info.children_number ?? [],
          updatePosition,
          scheduleDataModel.month_info.children_number ?? [],
          missingDays
        ),
        extra_workers: ArrayHelper.update(
          updatedMonthDataModel.month_info.extra_workers ?? [],
          updatePosition,
          scheduleDataModel.month_info.extra_workers ?? [],
          missingDays
        ),
      };

      validateMonthDM(updatedMonthDataModel);
      await this.localMonthRevisionManager.saveMonthRevision(
        getRevisionTypeFromKey(revisionKey),
        updatedMonthDataModel
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      error.status !== 404 && console.error(error);
    }
  }
}
