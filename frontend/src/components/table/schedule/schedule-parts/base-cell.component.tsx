import React from "react";
import "./base-cell.css";
import { CellOptions, CellState } from "./cell-options.model";

export function BaseCellComponent({
  index,
  value,
  className = "",
  dayType = "",
  isEditable = true,
  onDataChanged,
  onStateChange,
  onContextMenu,
  pushToRow,
  isSelected
}: CellOptions) {

  const inputRef = React.createRef<HTMLInputElement>();  

  function setCellState(state: CellState) {
    switch(state) {
      case CellState.START_EDITING:
        pushToRow && pushToRow(index);
        break;
    }
    if (onStateChange) {
      onStateChange(CellState.START_EDITING);
    }
  }

  function saveCellValue(newValue: string) {
    if (onDataChanged) {
      onDataChanged(newValue);
    }
    
    if (onStateChange) {
      onStateChange(CellState.STOP_EDITING);
    }
  }

  function handleKeyPress(key: string, currentInputValue) {
      if (isSelected && key === "Enter") {
        saveCellValue(currentInputValue);
    } else if (key === "Escape") {
      onStateChange && onStateChange(CellState.STOP_EDITING);
    }

  }

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    onContextMenu && onContextMenu(index, isEditable);
  }

  //  #region view
  return (
    <td
      className={isEditable ? `cell ${className || ""} ${dayType}` : "cell frozen"}
      onClick={(e) => setCellState(CellState.START_EDITING)}
      onContextMenu={handleContextMenu}>
      
      {isSelected &&  <input
                            defaultValue={value}
                            autoFocus={true}
                            onKeyDown={(e) => handleKeyPress(e.key, inputRef.current?.value || value)}
                            ref={inputRef}
                            className="cell-input"/>
      }
      
      {!isSelected && <span>{value}</span>}
    
    </td>
  );
  //#endregion
}
