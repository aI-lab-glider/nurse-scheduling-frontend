import React, { useContext, useEffect, useState } from "react";
import { DataRow } from "../../../../logic/schedule-logic/data-row";
import { DirectionKey } from "../sections/base-section/base-section.component";
import { ScheduleLogicContext } from "../use-schedule-state";
import { BaseCellComponent, BaseCellOptions } from "./base-cell.component";
import { ShiftHelper } from "../../../../helpers/shifts.helper";

enum CellManagementKeys {
  Enter = "Enter",
  Escape = "Escape",
}

export interface ScheduleRowOptions {
  uuid: string;
  index: number;
  dataRow: DataRow;
  sectionKey?: string;
  showSelectedCells?: boolean;
  cellComponent?: (BaseCellOptions: BaseCellOptions) => JSX.Element;
  onKeyDown?: (cellIndex: number, event: React.KeyboardEvent) => void;
  onClick?: (cellIndex: number) => void;
  onStateUpdate?: (row: DataRow) => void;
  pointerPosition?: number;
  onRowKeyClick?: () => void;
  onBlur?: () => void;
}

export function ScheduleRowComponent({
  index,
  dataRow,
  sectionKey,
  cellComponent: CellComponent = BaseCellComponent,
  showSelectedCells,
  pointerPosition = -1,
  onKeyDown,
  onClick,
  onStateUpdate,
  onRowKeyClick,
  onBlur,
  uuid,
}: ScheduleRowOptions): JSX.Element {
  const scheduleLogic = useContext(ScheduleLogicContext);
  const [dataRowState, setDataRowState] = useState<DataRow>(dataRow);
  useEffect(() => {
    setDataRowState(dataRow);
  }, [dataRow, uuid]);
  const [frozenShifts, setFrozenShifts] = useState<[number, number][]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [previousDirectionKey, setPreviousDirectionKey] = useState("");

  useEffect(() => {
    if (!selectionMode) {
      setSelectedCells([]);
    }
  }, [selectionMode]);
  const verboseDates = scheduleLogic?.metadataProvider?.verboseDates;

  function onContextMenu(cellIndex: number): void {
    if (scheduleLogic) {
      scheduleLogic.changeShiftFrozenState(index, cellIndex, setFrozenShifts);
    }
  }
  function saveValue(newValue: string): void {
    if (sectionKey)
      scheduleLogic?.updateRow(
        sectionKey,
        index - 1,
        [...selectedCells, pointerPosition],
        newValue,
        (newDataRow) => {
          setDataRowState(newDataRow);
          onStateUpdate && onStateUpdate(newDataRow);
        }
      );
    setSelectedCells([]);
  }

  function isFrozen(cellInd: number): boolean {
    return (
      verboseDates?.[cellInd]?.isFrozen ||
      !!frozenShifts.find((fS) => fS[0] === index && fS[1] === cellInd) ||
      false
    );
  }

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
      // TODO: refactor. It solves problem with wrong elements selection on the ends when direction changes
      // Issue could be solved, if make logic to react on onKeyDown event from cell in which
      // we enter, not from cell which we leave
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

  return (
    <tr className="row">
      <BaseCellComponent
        index={0}
        value={dataRowState.rowKey || ""}
        isSelected={false}
        isBlocked={false}
        isPointerOn={false}
        onClick={(): void => onRowKeyClick && onRowKeyClick()}
      />
      {dataRowState.rowData(false).map((cellData, cellIndex) => {
        return (
          <CellComponent
            index={cellIndex}
            key={`${dataRowState.rowKey}_${cellData}${cellIndex}${isFrozen(cellIndex)}_${uuid}}`}
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
