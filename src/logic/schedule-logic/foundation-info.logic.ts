import { WorkerType } from "../../common-models/worker-info.model";
import { DataRowHelper } from "../../helpers/data-row.helper";
import { FoundationInfoProvider } from "../providers/foundation-info-provider.model";
import { Sections } from "../providers/schedule-provider.model";
import { ChildrenSectionKey, ExtraWorkersSectionKey, FoundationSectionKey } from "../section.model";
import { BaseSectionLogic } from "./base-section-logic.model";
import { DataRow } from "./data-row";
export interface FoundationInfoDataItem {
  data: DataRow;
  editable: boolean;
}
export class FoundationInfoLogic
  extends FoundationInfoProvider
  implements Omit<BaseSectionLogic, "addDataRow"> {
  get sectionKey(): keyof Sections {
    return "FoundationInfo";
  }

  get childrenInfo(): number[] {
    return (
      this.rows
        .find((d) => d.data.rowKey === ChildrenSectionKey.RegisteredChildrenCount)
        ?.data.rowData() ?? []
    );
  }
  get extraWorkersInfo(): number[] {
    return (
      this.rows
        .find((d) => d.data.rowKey === ExtraWorkersSectionKey.ExtraWorkersCount)
        ?.data.rowData() ?? []
    );
  }
  private rows: FoundationInfoDataItem[] = [
    {
      data: new DataRow(
        FoundationSectionKey.ChildrenCount,
        this.sections.ChildrenInfo.registeredChildrenNumber
      ),
      editable: true,
    },
    {
      data: new DataRow(FoundationSectionKey.NurseCount, this.getWorkersCount(WorkerType.NURSE)),
      editable: false,
    },
    {
      data: new DataRow(
        FoundationSectionKey.BabysittersCount,
        this.getWorkersCount(WorkerType.OTHER)
      ),
      editable: false,
    },
    {
      data: new DataRow(
        FoundationSectionKey.ExtraWorkersCount,
        this.sections.ExtraWorkersInfo.extraWorkers
      ),
      editable: true,
    },
  ];

  get sectionData(): DataRow[] {
    return this.rows.map((r) => r.data);
  }
  updateDataRow(rowIndex: number, updateIndexes: number[], newValue: string): DataRow {
    if (this.rows[rowIndex].editable) {
      this.rows[rowIndex].data = DataRowHelper.updateDataRowsIndicies(
        this.sectionData,
        rowIndex,
        updateIndexes,
        newValue
      );
    }
    return this.rows[rowIndex].data;
  }
}
