/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useContext } from "react";
import {
  GroupedScheduleErrors,
  ScheduleError,
} from "../../../../../common-models/schedule-error.model";
import { ArrayHelper } from "../../../../../helpers/array.helper";
import { DataRowHelper } from "../../../../../helpers/data-row.helper";
import { Sections } from "../../../../../logic/providers/schedule-provider.model";
import { DataRow } from "../../../../../logic/schedule-logic/data-row";
import { ScheduleLogicContext } from "../use-schedule-state";
import { BaseCellComponent, BaseCellOptions } from "./base-cell/base-cell.component";
import { PivotCell } from "./hooks/use-cell-selection";

export interface BaseRowOptions {
  uuid: string;
  rowIndex: number;
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
  errorSelector?: (cellIndex: number, scheduleErrors: GroupedScheduleErrors) => ScheduleError[];
}

export interface CellDataItem {
  value: string;
}

function isCellDataItemArray(array: any[]): array is CellDataItem[] {
  return array[0].value !== undefined;
}
function toCellDataItemArray(array: any[]): CellDataItem[] {
  if (isCellDataItemArray(array)) return array;
  return array.map((item) => ({ value: item as string }));
}

export function BaseRowComponentF(options: BaseRowOptions): JSX.Element {
  const {
    rowIndex,
    dataRow,
    sectionKey,
    cellComponent: CellComponent = BaseCellComponent,
    pointerPosition = -1,
    onKeyDown,
    onClick,
    uuid,
    onDrag,
    onDragEnd,
    onSave,
    selection = [],
    isEditable = true,
    errorSelector,
  } = options;

  const scheduleLogic = useContext(ScheduleLogicContext);
  const verboseDates = scheduleLogic?.sections.Metadata?.verboseDates;
  const currMonthNumber = scheduleLogic?.sections.Metadata.monthNumber;
  const numberOfDays = verboseDates?.length;

  function saveValue(newValue: string): void {
    if (sectionKey) onSave?.(newValue);
  }

  let data = toCellDataItemArray(dataRow.rowData(false));

  if (numberOfDays && data.length !== numberOfDays) {
    const diff = numberOfDays - data.length;
    data = [...data, ...Array.from(Array(diff))];
  }

  return (
    <tr className="row scheduleStyle" id="mainRow">
      {data.map((dataItem, cellIndex) => {
        return (
          <CellComponent
            {...{
              ...options,
              ...dataItem,
            }}
            cellIndex={cellIndex}
            key={`${dataItem.value}${cellIndex}_${uuid}}`}
            isSelected={selection[cellIndex]}
            isBlocked={!isEditable}
            isPointerOn={cellIndex === pointerPosition}
            onKeyDown={(event): void => onKeyDown?.(cellIndex, event)}
            onValueChange={saveValue}
            onClick={(): void => onClick?.(cellIndex)}
            verboseDate={verboseDates?.[cellIndex]}
            errorSelector={(scheduleErrors): ScheduleError[] =>
              errorSelector?.(cellIndex, scheduleErrors) ?? []
            }
            onDrag={(pivot): void => onDrag?.(pivot, cellIndex)}
            onDragEnd={(): void => onDragEnd?.(rowIndex, cellIndex)}
            monthNumber={currMonthNumber}
          />
        );
      })}
    </tr>
  );
}

export const BaseRowComponent = React.memo(BaseRowComponentF, (prev, next) => {
  return (
    DataRowHelper.areDataRowsEqual(prev.dataRow, next.dataRow) &&
    ArrayHelper.arePrimitiveArraysEqual(prev.selection ?? [], next.selection ?? []) &&
    prev.pointerPosition === next.pointerPosition
  );
});
