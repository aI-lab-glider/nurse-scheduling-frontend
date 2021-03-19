/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useContext } from "react";
import { ScheduleError } from "../../../../../common-models/schedule-error.model";
import { ScheduleLogicContext } from "../use-schedule-state";
import { BaseCellComponent } from "./base-cell/base-cell.component";
import { baseRowDataCy, BaseRowOptions, toCellDataItemArray } from "./base-row.models";

export function BaseRowComponent(options: BaseRowOptions): JSX.Element {
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
  const firstMonthDayIndex = scheduleLogic?.sections.Metadata.dates.findIndex((day) => day === 1);

  const isCellFromPrevMonth = (index, firstMonthDayIndex): boolean => {
    return index < firstMonthDayIndex;
  };

  function saveValue(newValue: string): void {
    if (sectionKey) onSave?.(newValue);
  }

  let data = toCellDataItemArray(dataRow.rowData(false));

  if (numberOfDays && data.length !== numberOfDays) {
    const diff = numberOfDays - data.length;
    data = [...data, ...Array.from(Array(diff))];
  }

  return (
    <div className="row scheduleStyle" id="mainRow" data-cy={baseRowDataCy(rowIndex)}>
      {data.map((dataItem = { value: defaultEmpty }, cellIndex) => (
        <CellComponent
          {...{
            ...options,
            ...dataItem,
          }}
          cellIndex={cellIndex}
          key={`${dataItem.value}_${cellIndex}_${uuid}`}
          isSelected={selection[cellIndex]}
          isPointerOn={cellIndex === pointerPosition}
          isBlocked={!isEditable || isCellFromPrevMonth(cellIndex, firstMonthDayIndex)}
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
      ))}
    </div>
  );
}
