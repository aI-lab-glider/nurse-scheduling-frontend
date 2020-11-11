import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DataRow } from "../../../../logic/schedule-logic/data-row";
import { DirectionKey } from "../sections/base-section/base-section.component";
import { ScheduleLogicContext } from "../use-schedule-state";
import { BaseCellComponent, BaseCellOptions } from "./base-cell.component";
import { ShiftHelper } from "../../../../helpers/shifts.helper";
import { Sections } from "../../../../logic/providers/schedule-provider.model";
import { DataRowHelper } from "../../../../helpers/data-row.helper";

enum CellManagementKeys {
  Enter = "Enter",
  Escape = "Escape",
}

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
    setSelectedCells([]);
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

  function handleKeyPress(cellIndex: number, cellValue: string, event: React.KeyboardEvent): void {
    if (event.key === CellManagementKeys.Enter) {
      saveValue(cellValue);
    }

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
      setSelectedCells([]);
      setSelectionMode(false);
    }
    onKeyDown && onKeyDown(cellIndex, event);
  }

  const data = useMemo(() => dataRow.rowData(false), [dataRow]);
  return (
    <tr className="row">
      {data.length !== 0 && (
        <BaseCellComponent
          index={0}
          value={dataRow.rowKey || ""}
          isSelected={false}
          isBlocked={false}
          isPointerOn={false}
          onClick={(): void => onRowKeyClick && onRowKeyClick()}
        />
      )}
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
            onKeyDown={(cellValue, event): void => handleKeyPress(cellIndex, cellValue, event)}
            onContextMenu={(): void => onContextMenu(cellIndex)}
            onClick={(): void => onClick && onClick(cellIndex)}
            onBlur={(): void => onBlur && onBlur()}
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
