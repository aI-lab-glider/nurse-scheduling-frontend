import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DataRow } from "../../../../../logic/schedule-logic/data-row";
import { DirectionKey } from "../sections/base-section/base-section.component";
import { ScheduleLogicContext } from "../use-schedule-state";
import {
  BaseCellComponent,
  BaseCellOptions,
  CellManagementKeys,
} from "./base-cell/base-cell.component";
import { ShiftHelper } from "../../../../../helpers/shifts.helper";
import { Sections } from "../../../../../logic/providers/schedule-provider.model";
import { DataRowHelper } from "../../../../../helpers/data-row.helper";

export interface BaseRowOptions {
  uuid: string;
  index: number;
  dataRow: DataRow;
  sectionKey?: keyof Sections;
  showSelectedCells?: boolean;
  cellComponent?: React.FC<BaseCellOptions>;
  onKeyDown?: (cellIndex: number, event: React.KeyboardEvent) => void;
  onClick?: (cellIndex: number) => void;
  onStateUpdate?: (row: DataRow) => void;
  pointerPosition?: number;
  onRowKeyClick?: () => void;
  onBlur?: () => void;
  resetPointer?: () => void;
}

export function BaseRowComponentF({
  index,
  dataRow,
  sectionKey,
  cellComponent: CellComponent = BaseCellComponent,
  showSelectedCells,
  pointerPosition = -1,
  onKeyDown,
  onClick,
  onRowKeyClick,
  onBlur,
  uuid,
  resetPointer,
}: BaseRowOptions): JSX.Element {
  const scheduleLogic = useContext(ScheduleLogicContext);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [previousDirectionKey, setPreviousDirectionKey] = useState("");

  useEffect(() => {
    if (!selectionMode) {
      setSelectedCells([]);
    }
  }, [selectionMode]);

  const verboseDates = scheduleLogic?.sections.Metadata?.verboseDates;

  const currMonthNumber = scheduleLogic?.sections.Metadata.monthNumber;

  const numberOfDays = verboseDates?.length;

  const onContextMenu = useCallback(
    (cellIndex: number): void => {
      if (scheduleLogic) {
        scheduleLogic.changeShiftFrozenState(index, cellIndex);
      }
    },
    [scheduleLogic, index]
  );

  function saveValue(newValue: string): void {
    if (sectionKey)
      scheduleLogic?.updateRow(
        sectionKey,
        index - 1,
        [...selectedCells, pointerPosition],
        newValue
      );
    clearSelection();
  }

  const isFrozen = useCallback((cellInd: number): boolean => {
    // TODO handle frozen dates
    return false;
  }, []);

  function toggleSelection(cellIndex: number): void {
    if (selectedCells.includes(cellIndex)) {
      setSelectedCells(
        selectedCells.filter((selectedCellIndex) => cellIndex !== selectedCellIndex)
      );
    } else {
      setSelectedCells([...selectedCells, cellIndex]);
    }
  }

  function handleKeyPress(cellIndex: number, event: React.KeyboardEvent): void {
    if (event.ctrlKey && DirectionKey[event.key]) {
      !selectionMode && setSelectionMode(true);
      if (previousDirectionKey === DirectionKey[event.key] || !selectionMode) {
        toggleSelection(cellIndex);
      }
      setPreviousDirectionKey(DirectionKey[event.key]);
    } else if (
      event.key === DirectionKey.ArrowRight ||
      event.key === DirectionKey.ArrowLeft || // if moves in any direction withour CTRL - disable selection
      event.key === CellManagementKeys.Escape
    ) {
      clearSelection();
    }
    onKeyDown && onKeyDown(cellIndex, event);
  }

  function clearSelection(): void {
    resetPointer && resetPointer();
    setSelectedCells([]);
    setSelectionMode(false);
  }

  let data = useMemo(() => dataRow.rowData(false), [dataRow]);

  if (numberOfDays && data.length !== numberOfDays) {
    const diff = numberOfDays - data.length;
    data = [...data, ...Array.from(Array(diff))];
  }

  return (
    <tr className="row" id="mainRow">
      {data.map((cellData, cellIndex) => {
        return (
          <CellComponent
            index={cellIndex}
            key={`${dataRow.rowKey}_${cellData}${cellIndex}${isFrozen(cellIndex)}_${uuid}}`}
            value={cellData}
            isSelected={(showSelectedCells || false) && selectedCells.includes(cellIndex)}
            style={ShiftHelper.getShiftColor(
              cellData,
              verboseDates?.[cellIndex],
              isFrozen(cellIndex)
            )}
            isPointerOn={(showSelectedCells || false) && cellIndex === pointerPosition}
            isBlocked={isFrozen(cellIndex)}
            onKeyDown={(event): void => handleKeyPress(cellIndex, event)}
            onValueChange={saveValue}
            onContextMenu={(): void => onContextMenu(cellIndex)}
            onClick={(): void => onClick && onClick(cellIndex)}
            onBlur={(): void => onBlur && onBlur()}
            monthNumber={currMonthNumber}
            verboseDate={verboseDates?.[cellIndex]}
          />
        );
      })}
    </tr>
  );
}

export const BaseRowComponent = React.memo(BaseRowComponentF, (prev, next) => {
  return (
    DataRowHelper.areDataRowsEqual(prev.dataRow, next.dataRow) &&
    prev.pointerPosition === next.pointerPosition
  );
});
