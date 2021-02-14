/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Sections } from "../../../../../logic/providers/schedule-provider.model";
import { DataRow } from "../../../../../logic/schedule-logic/data-row";
import { BaseCellOptions, PivotCell } from "./base-cell/base-cell.models";

export const baseRowDataCy = (index: number): string => `${index}Row`;
export interface BaseRowOptions {
  uuid: string;
  index: number;
  dataRow: DataRow;
  sectionKey: keyof Sections;
  cellComponent?: React.FC<BaseCellOptions>;
  onKeyDown?: (cellIndex: number, event: React.KeyboardEvent) => void;
  onClick?: (cellIndex: number) => void;
  onStateUpdate?: (row: DataRow) => void;
  pointerPosition?: number;
  onBlur?: () => void;
  onDrag?: (pivot: PivotCell, cellInd: number) => void;
  onDragEnd?: (rowInd: number, cellInd: number) => void;
  onSave?: (newValue: string) => void;
  selection?: boolean[];
  isEditable?: boolean;
}
