import { RevisionType } from "../../../api/persistance-store.model";
import { ActionModel } from "../../models/action.model";

enum RevisionReducerAction {
  CHANGE_REVISION = "CHANGE_REVISION",
}

export class RevisionReducerActionCreator {
  static changeRevision(revision: RevisionType): ActionModel<RevisionType> {
    return {
      type: RevisionReducerAction.CHANGE_REVISION,
      payload: revision,
    };
  }
}

export function revisionInfoReducer(
  state: RevisionType = "primary",
  action: ActionModel<RevisionType>
): RevisionType {
  switch (action.type) {
    case RevisionReducerAction.CHANGE_REVISION:
      if (!action.payload) {
        return state;
      }
      return action.payload;
    default:
      return state;
  }
}
