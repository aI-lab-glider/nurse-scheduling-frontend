import React, { useContext } from "react";
import { DataRow } from "../../../../../logic/schedule-logic/data-row";
import { ScheduleLogicContext } from "../use-schedule-state";
import { BaseCellComponent, BaseCellOptions, PivotCell } from "./base-cell/base-cell.component";
import { ShiftHelper } from "../../../../../helpers/shifts.helper";
import { Sections } from "../../../../../logic/providers/schedule-provider.model";
import { DataRowHelper } from "../../../../../helpers/data-row.helper";
import { ArrayHelper } from "../../../../../helpers/array.helper";
import { useScheduleStyling } from "../../../../common-components/use-schedule-styling/use-schedule-styling";

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
    <tr className="row scheduleStyle" id="mainRow">
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
