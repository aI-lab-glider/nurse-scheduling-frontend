import { ActionModel } from "../models/action.model";

export enum xlxsSheetDataActionType {
  UPDATE = "updateXlxsData",
}
export function xlxsSheetDataReducer(
  state: Array<object> = [],
  action: ActionModel<Array<object>>
) {
  switch (action.type) {
    case xlxsSheetDataActionType.UPDATE:
      return [...action.payload];
    default:
      return state;
  }
}
