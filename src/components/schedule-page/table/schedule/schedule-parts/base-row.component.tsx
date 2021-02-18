/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useContext } from "react";
import { ArrayHelper } from "../../../../../helpers/array.helper";
import { DataRowHelper } from "../../../../../helpers/data-row.helper";
import { ShiftHelper } from "../../../../../helpers/shifts.helper";
import { useScheduleStyling } from "../../../../common-components/use-schedule-styling/use-schedule-styling";
import { ScheduleLogicContext } from "../use-schedule-state";
import { BaseCellComponent } from "./base-cell/base-cell.component";
import { BaseRowOptions, baseRowDataCy } from "./base-row.models";

export function BaseRowComponentF({
  index,
  dataRow,
  sectionKey,
  cellComponent: CellComponent = BaseCellComponent,
  pointerPosition = -1,
  onKeyDown,
  onClick,
  onBlur,
  uuid,
  onDrag,
  onDragEnd,
  onSave,
  selection = [],
  isEditable = true,
}: BaseRowOptions): JSX.Element {
  const scheduleLogic = useContext(ScheduleLogicContext);
  const verboseDates = scheduleLogic?.sections.Metadata?.verboseDates;
  const currMonthNumber = scheduleLogic?.sections.Metadata.monthNumber;
  const numberOfDays = verboseDates?.length;

  function saveValue(newValue: string): void {
    if (sectionKey) onSave?.(newValue);
  }
  let data = dataRow.rowData(false);

  if (numberOfDays && data.length !== numberOfDays) {
    const diff = numberOfDays - data.length;
    data = [...data, ...Array.from(Array(diff))];
  }

  data = useScheduleStyling(data);

  return (
    <tr className="row scheduleStyle" id="mainRow" data-cy={baseRowDataCy(index)}>
      {data.map(({ cellData, keepOn, hasNext }, cellIndex) => {
        return (
          <CellComponent
            sectionKey={sectionKey}
            rowIndex={index}
            keepOn={keepOn}
            hasNext={hasNext}
            index={cellIndex}
            key={`${cellData}${cellIndex}_${uuid}}`}
            value={cellData}
            isSelected={selection[cellIndex]}
            style={ShiftHelper.getShiftColor(cellData, verboseDates?.[cellIndex])}
            isPointerOn={cellIndex === pointerPosition}
            isBlocked={!isEditable}
            onKeyDown={(event): void => onKeyDown?.(cellIndex, event)}
            onValueChange={saveValue}
            onClick={(): void => onClick?.(cellIndex)}
            onBlur={(): void => onBlur?.()}
            monthNumber={currMonthNumber}
            verboseDate={verboseDates?.[cellIndex]}
            onDrag={(pivot): void => onDrag?.(pivot, cellIndex)}
            onDragEnd={(): void => onDragEnd?.(index, cellIndex)}
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
