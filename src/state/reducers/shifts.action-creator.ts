/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { MonthUpdater, ThunkFunction } from "../../api/persistance-store.model";
import * as _ from "lodash";
import { Shift, ShiftCode } from "../../common-models/shift-info.model";
import { MonthDataModel } from "../../common-models/schedule-data.model";
import { updateStateAndDB } from "../../logic/month-update/month-update.logic";
import { StringHelper } from "../../helpers/string.helper";

export class ShiftsActionCreator {
  static addNewShift(createdShift) {
    return async (dispatch, getState): Promise<void> => {
      const updateFunc: MonthUpdater = (month: MonthDataModel) =>
        this.addNewShiftToMonth(month, createdShift);
      await updateStateAndDB(dispatch, getState, updateFunc);
    };
  }

  static deleteShift(shift: Shift | undefined): ThunkFunction<unknown> {
    return async (dispatch, getState): Promise<void> => {
      if (!shift) return;
      const updateFunc: MonthUpdater = (month: MonthDataModel) =>
        this.deleteShiftFromMonthDM(month, shift);
      await updateStateAndDB(dispatch, getState, updateFunc);
    };
  }

  static modifyShift(createdShift, selectedShift) {
    return async (dispatch, getState): Promise<void> => {
      const updateFunc: MonthUpdater = (month: MonthDataModel) =>
        this.modifyShiftFromDM(month, createdShift, selectedShift);
      await updateStateAndDB(dispatch, getState, updateFunc);
    };
  }

  private static addNewShiftToMonth(monthDataModel: MonthDataModel, shift: Shift): MonthDataModel {
    const monthDataModelCopy = _.cloneDeep(monthDataModel);
    monthDataModelCopy[shift.code] = shift;
    return monthDataModelCopy;
  }

  private static deleteShiftFromMonthDM(
    monthDataModel: MonthDataModel,
    shift: Shift
  ): MonthDataModel {
    const monthDataModelCopy = _.cloneDeep(monthDataModel);
    Object.entries(monthDataModelCopy.shifts).forEach(([workerName, workersShifts]) => {
      monthDataModelCopy.shifts[workerName] = workersShifts.map(
        (shiftCodeInArray): ShiftCode =>
          StringHelper.areEquivalent(shiftCodeInArray, shift.code) ? ShiftCode.W : shiftCodeInArray
      );
    });
    delete monthDataModelCopy.shift_types[shift.code];
    return monthDataModelCopy;
  }

  private static modifyShiftFromDM(
    monthDataModel: MonthDataModel,
    newShift: Shift,
    oldShift: Shift
  ): MonthDataModel {
    let monthCopy = this.addNewShiftToMonth(monthDataModel, newShift);
    if (newShift.code !== oldShift.code) {
      monthCopy = this.deleteShiftFromMonthDM(monthCopy, oldShift);
    }
    return monthCopy;
  }
}
