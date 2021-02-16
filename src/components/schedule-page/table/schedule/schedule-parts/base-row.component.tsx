/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useContext } from "react";
import { ScheduleError } from "../../../../../common-models/schedule-error.model";
import { ArrayHelper } from "../../../../../helpers/array.helper";
import { DataRowHelper } from "../../../../../helpers/data-row.helper";
import { ScheduleLogicContext } from "../use-schedule-state";
import { BaseCellComponent } from "./base-cell/base-cell.component";
import { BaseRowOptions, toCellDataItemArray } from "./base-row.models";

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
    defaultEmpty = "",
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
      {data.map((dataItem = { value: defaultEmpty }, cellIndex) => {
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
