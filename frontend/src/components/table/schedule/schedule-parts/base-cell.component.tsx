import React from "react";
import { ColorHelper } from "../../../../helpers/colors/color.helper";
import "./base-cell.css";
import { CellColorSet } from "../../../../helpers/colors/cell-color-set.model";

export interface BaseCellOptions {
  index: number;
  value: string;
  style?: CellColorSet;
  isBlocked: boolean;
  isPointerOn: boolean;
  isSelected: boolean;
  onClick?: () => void;
  onContextMenu?: () => void;
  onKeyDown?: (cellValue: string, event: React.KeyboardEvent) => void;
  onBlur?: () => void;
}

export function BaseCellComponent({
  value,
  style = ColorHelper.DEFAULT_COLOR_SET,
  isBlocked,
  isSelected,
  isPointerOn,
  onKeyDown,
  onContextMenu,
  onClick,
  onBlur,
}: BaseCellOptions): JSX.Element {
  const inputRef = React.createRef<HTMLInputElement>();

  function handleContextMenu(e: React.MouseEvent): void {
    e.preventDefault();
    onContextMenu && onContextMenu();
  }

  return (
    <td
      className={"cell"}
      onClick={(): void => {
        if (!isBlocked && onClick) {
          onClick();
        }
      }}
      onContextMenu={handleContextMenu}
      style={{
        color: style.textColor.toString(),
        backgroundColor:
          isSelected || isPointerOn
            ? ColorHelper.getHighlightColor().toString()
            : style.backgroundColor.toString(),
      }}
      onKeyDown={(e): void => {
        onKeyDown && onKeyDown(inputRef.current?.value || value, e);
      }}
      onBlur={(e): void => {
        onBlur && onBlur();
      }}
    >
      {isPointerOn && !isBlocked && (
        <input defaultValue={value} autoFocus={true} ref={inputRef} className="cell-input" />
      )}

      {(!isPointerOn || (isPointerOn && isBlocked)) && <span>{value}</span>}
    </td>
  );
}
