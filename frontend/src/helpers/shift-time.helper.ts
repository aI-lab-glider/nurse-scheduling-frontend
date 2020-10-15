import { ShiftCode } from "../state/models/schedule-data/shift-info.model";

export const shiftCodeToWorkTime = (shiftCode: ShiftCode): number => {
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
};
