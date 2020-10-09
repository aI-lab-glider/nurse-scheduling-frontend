import React from "react";
import { ColorProvider } from "../../../../helpers/colors/color.provider";
import "./base-cell.css";
import { CellOptions, CellState } from "./cell-options.model";

export function BaseCellComponent({
  index,
  value,
  className = "",
  verboseDate,
  isEditable = true,
  onDataChanged,
  onStateChange,
  onContextMenu,
  pushToRow,
  isSelected,
  style
}: CellOptions) {
  if (isEditable === undefined || isEditable === null ) {
    isEditable = true;
  }
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

  function handleKeyPress(key: string, currentInputValue: string) {
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

  function getBackgroundColor(): string { 
    return style?.backgroundColor.toString() || ColorProvider.getDayColor(verboseDate).backgroundColor.toString() 
  }
  
  function getTextColor(): string { 
    return style?.textColor.toString() || ColorProvider.getDayColor(verboseDate).textColor.toString() 
  }
  //  #region view
  return (
    <td
      className={`cell ${className}`}
      onClick={(e) => setCellState(CellState.START_EDITING)}
      onContextMenu={handleContextMenu}
      style={{
          color: getTextColor(),
          backgroundColor: getBackgroundColor()
        }}>
      
      {isSelected &&  <input defaultValue={value}
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
