import { DataRowParser } from "./data-row.parser";
import { MetaDataParser } from "./metadata.parser";
import { DataRowHelper } from "../../helpers/data-row.helper";
import { ChildrenSectionKey } from "../section.model";
import { ChildrenInfoProvider } from "../providers/children-info-provider.model";
import { StringHelper } from "../../helpers/string.helper";

export class ChildrenInfoParser implements ChildrenInfoProvider {
  private readonly _sectionData: { [rowKey in ChildrenSectionKey]?: DataRowParser };

  constructor(childrenInfoSectionRows: DataRowParser[], metaData: MetaDataParser) {
    const processedSection = childrenInfoSectionRows
      .map((row) => row.createWithCroppedData(metaData.validDataStart, metaData.validDataEnd + 1))
      .filter((row) => this.isValidRow(row));

    this._sectionData = DataRowHelper.dataRowsAsDataRowDict(processedSection);
  }

  public get registeredChildrenNumber(): number[] {
    const key = StringHelper.getRawValue(ChildrenSectionKey.RegisteredChildrenCount);
    return this._sectionData[key]?.rowData(true, false).map((i) => parseInt(i)) ?? [];
  }

  public get sectionData(): DataRowParser[] {
    return Object.values(this._sectionData).filter((row) => !!row) as DataRowParser[];
  }

  private isValidRow(row: DataRowParser): boolean {
    const validKey = Object.values(ChildrenSectionKey).find((k) =>
      StringHelper.areEquivalent(k, row.rowKey)
    );
    return !!validKey;
  }
}
