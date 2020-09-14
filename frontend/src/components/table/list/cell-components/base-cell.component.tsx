import React, { useState } from "react";
import { StringHelper } from "../../../../helpers/string.helper";
import "./base-cell.css";
import { CellOptions, CellState } from "./cell-options.model";

export function BaseCellComponent({
  value,
  className = "",
  isEditable = true,
  onDataChange,
  onStateChange,
}: CellOptions) {
  const [cellValue, setCellValue] = useState(value);

  let isEditing = false;

  const inputRef = React.createRef<HTMLInputElement>();
  const notEditableContent = (value) => <span>{value}</span>;
  const editableContent = (
    <input
      defaultValue={cellValue}
      autoFocus={true}
      onBlur={(e) => onCellValueSave(e.target.value)}
      onKeyPress={(e) => handleKeyPress(e.key, inputRef.current?.value || "")}
      ref={inputRef}
      className="cell-input"
    />
  );
  const [content, setContent] = useState<JSX.Element>(notEditableContent(value));

  function onCellClicked(_e: any) {
    if (!isEditing && isEditable) {
      isEditing = true;
      setContent(editableContent);
    }
    if (onStateChange) {
      onStateChange(CellState.START_EDITING);
    }
  }

  function onCellValueSave(newValue: string) {
    isEditing = false;
    setCellValue(newValue);
    if (onDataChange) {
      onDataChange(newValue);
    }
    if (onStateChange) {
      onStateChange(CellState.STOP_EDITING);
    }
    setContent(notEditableContent(newValue));
  }

  function handleKeyPress(key: string, currentInputValue) {
    if (isEditing && StringHelper.getRawValue(key) === "enter") {
      onCellValueSave(currentInputValue);
    }
  }
  //  #region view
  return (
    <td className={`cell ${className || ""}`} onClick={onCellClicked}>
      {content}
    </td>
  );
  //#endregion
}
