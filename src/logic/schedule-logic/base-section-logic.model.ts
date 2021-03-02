/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { DataRowHelper } from "../../helpers/data-row.helper";
import { Sections } from "../providers/schedule-provider.model";
import { DataRow } from "./data-row";

export abstract class BaseSectionLogic {
  private isEditable = true;
  abstract get sectionKey(): keyof Sections;

  constructor(private data: DataRow[]) {}

  addDataRow(newRow: DataRow): DataRow[] {
    this.sectionData = [...this.sectionData, newRow];
    return this.sectionData;
  }

  update(selectionMatrix: boolean[][], newValue: string): void {
    this.sectionData = DataRowHelper.copyWithReplaced(selectionMatrix, this.sectionData, newValue);
  }

  disableEdit(): void {
    this.isEditable = false;
    this.data.forEach((row) => {
      row.disableEdit();
    });
  }

  get sectionData(): DataRow[] {
    return this.data;
  }

  set sectionData(dataRows: DataRow[]) {
    this.data = dataRows;
    if (!this.isEditable) {
      this.disableEdit();
    }
  }
}
