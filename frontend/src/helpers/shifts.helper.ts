import { WorkerType } from "../common-models/worker-info.model";
import { ShiftCode, ShiftInfoModel } from "../common-models/shift-info.model";
import { ArrayHelper } from "./array.helper";

export function shiftCodeToWorkTime(shiftCode: ShiftCode): number {
  switch (shiftCode) {
    case ShiftCode.R:
      return 8;
    case ShiftCode.P:
      return 4;
    case ShiftCode.D:
      return 12;
    case ShiftCode.N:
      return 12;
    case ShiftCode.DN:
      return 24;
    case ShiftCode.PN:
      return 16;
    default:
      return 0;
  }
}

export function groupShiftsByWorkerType(
  shifts: ShiftInfoModel,
  workerTypes: { [workerName: string]: WorkerType }
): { [key: string]: ShiftInfoModel } {
  const grouped = ArrayHelper.arrayToObject<WorkerType, ShiftInfoModel>(
    Object.values(WorkerType),
    (wt) => wt
  );
  const shiftEntries = Object.entries(shifts).map((a) => ({
    workerName: a[0],
    shifts: a[1],
  }));
  const sortedShifts = shiftEntries.sort(({ workerName: wn1 }, { workerName: wn2 }) =>
    wn1 > wn2 ? 1 : wn1 < wn2 ? -1 : 0
  );
  sortedShifts.forEach(({ workerName, shifts }) => {
    const category = workerTypes[workerName] || "";
    grouped[category][workerName] = shifts;
  });
  return grouped;
}
