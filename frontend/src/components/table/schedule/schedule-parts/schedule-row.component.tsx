import React, { useContext, useEffect, useState } from "react";
import { ColorProvider } from "../../../../helpers/colors/color.provider";
import { DataRow } from "../../../../logic/real-schedule-logic/data-row";
import { DirectionKey } from "../sections/base-section/base-section.component";
import { ScheduleLogicContext } from "../use-schedule-state";
import { BaseCellComponent } from "./base-cell.component";
import { CellOptions } from "./cell-options.model";
import "./schedule-row.component.css";

enum CellManagementKeys {
  Enter = "Enter",
  Escape = "Escape",
}
export interface ScheduleRowOptions {
  index: number;
  dataRow: DataRow;
  sectionKey?: string;
  cellComponent?: (cellOptions: CellOptions) => JSX.Element;
  onKeyDown?: (cellIndex: number, event: React.KeyboardEvent) => void;
  onClick?: (cellIndex: number) => void;
  onStateUpdate?: (row: DataRow) => void;
  pointerPosition?: number;
  onRowKeyClick?: () => void;
}

export function ScheduleRowComponent({
  index,
  dataRow,
  sectionKey,
  cellComponent: CellComponent = BaseCellComponent,
  pointerPosition = -1,
  onKeyDown,
  onClick,
  onStateUpdate,
  onRowKeyClick,
}: ScheduleRowOptions) {
  const scheduleLogic = useContext(ScheduleLogicContext);
  const [dataRowState, setDataRowState] = useState<DataRow>(dataRow);
  useEffect(() => {
    setDataRowState(dataRow);
  }, [dataRow]);
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

  function onContextMenu(cellIndex: number) {
    if (scheduleLogic) {
      scheduleLogic.changeShiftFrozenState(index, cellIndex, setFrozenShifts);
    }
  }
  function saveValue(newValue: string) {
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

  function isFrozen(cellInd: number) {
    return (
      verboseDates?.[cellInd]?.isFrozen ||
      !!frozenShifts.find((fS) => fS[0] === index && fS[1] === cellInd) ||
      false
    );
  }

  function toggleSelection(cellIndex: number) {
    if (selectedCells.includes(cellIndex)) {
      setSelectedCells(selectedCells.filter((selectedCellIndex) => cellIndex != selectedCellIndex));
    } else {
      setSelectedCells([...selectedCells, cellIndex]);
    }
  }

  function handleKeyPress(cellIndex: number, cellValue: string, event: React.KeyboardEvent) {
    if (event.key === CellManagementKeys.Enter) {
      saveValue(cellValue);
    }

    if (event.ctrlKey && DirectionKey[event.key]) {
      !selectionMode && setSelectionMode(true);
      // TODO: refactor. It solves problem with wrong elements selection on the ends when direction changes
      // Issue could be solved, if make logic to react on onKeyDown event from cell in which
      // we enter, not from cell which we leave
      if (previousDirectionKey == DirectionKey[event.key] || !selectionMode) {
        toggleSelection(cellIndex);
      }
      setPreviousDirectionKey(DirectionKey[event.key]);
    } else if (
      DirectionKey[event.key] || // if moves in any direction withour CTRL - disable selection
      event.key === CellManagementKeys.Escape
    ) {
      setSelectionMode(false);
    }
    onKeyDown && onKeyDown(cellIndex, event);
  }

  return (
    <tr className="row">
      <BaseCellComponent
        index={0}
        value={dataRow.rowKey || ""}
        isSelected={false}
        isBlocked={false}
        onContextMenu={() => {}}
        isPointerOn={false}
        onClick={() => onRowKeyClick && onRowKeyClick()}
      />
      {dataRowState.rowData(false).map((cellData, cellIndex) => {
        return (
          <CellComponent
            index={cellIndex}
            key={`${cellData}${cellIndex}${isFrozen(cellIndex)}`}
            value={cellData}
            isSelected={selectedCells.includes(cellIndex)}
            style={ColorProvider.getShiftColor(
              cellData,
              verboseDates?.[cellIndex],
              isFrozen(cellIndex)
            )}
            isPointerOn={cellIndex === pointerPosition}
            isBlocked={isFrozen(cellIndex)}
            onKeyDown={(cellValue, event) => handleKeyPress(cellIndex, cellValue, event)}
            onContextMenu={() => onContextMenu(cellIndex)}
            onClick={() => onClick && onClick(cellIndex)}
          />
        );
      })}
    </tr>
  );
}
