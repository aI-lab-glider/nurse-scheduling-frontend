import { WorkerType } from "../../common-models/worker-info.model";
import { FoundationInfoProvider } from "../providers/foundation-info-provider.model";
import { Sections } from "../providers/schedule-provider.model";
import { FoundationSectionKey } from "../section.model";
import { BaseSectionLogic } from "./base-section-logic.model";
import { DataRow } from "./data-row";

export class FoundationInfoLogic
  extends FoundationInfoProvider
  implements Omit<BaseSectionLogic, "addDataRow"> {
  get sectionKey(): keyof Sections {
    return "FoundationInfo";
  }

  updateDataRow(rowIndex: number, updateIndexes: number[], newValue: string): DataRow {
    throw new Error("Method not implemented.");
  }
  get sectionData(): DataRow[] {
    return [
      new DataRow(
        FoundationSectionKey.ChildrenCount,
        this.sections.ChildrenInfo.registeredChildrenNumber
      ),
      new DataRow(FoundationSectionKey.NurseCount, this.getWorkersCount()),
      new DataRow(FoundationSectionKey.BabysittersCount, this.getWorkersCount()),
      new DataRow(
        FoundationSectionKey.ExtraWorkersCount,
        this.sections.ExtraWorkersInfo.extraWorkers
      ),
    ];
  }
}
