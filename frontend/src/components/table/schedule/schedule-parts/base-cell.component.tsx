import React from "react";
import { ColorProvider } from "../../../../helpers/colors/color.provider";
import "./base-cell.css";
import { CellOptions } from "./cell-options.model";

export function BaseCellComponent({
  index,
  value,
  style = ColorProvider.DEFAULT_COLOR_SET,
  isBlocked,
  isSelected,
  isPointerOn,
  onKeyDown,
  onContextMenu,
  onClick,
}: CellOptions) {
  const inputRef = React.createRef<HTMLInputElement>();

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    onContextMenu && onContextMenu();
  }

  //  #region view
  return (
    <td
      className={`cell`}
      onClick={() => !isBlocked && onClick && onClick()}
      onContextMenu={handleContextMenu}
      style={{
        color: style.textColor.toString(),
        backgroundColor:
          isSelected || isPointerOn
            ? ColorProvider.getHighlightColor().toString()
            : style.backgroundColor.toString(),
      }}
      onKeyDown={(e) => {
        onKeyDown && onKeyDown(inputRef.current?.value || value, e);
      }}
    >
      {isPointerOn && !isBlocked && (
        <input defaultValue={value} autoFocus={true} ref={inputRef} className="cell-input" />
      )}

      {(!isPointerOn || (isPointerOn && isBlocked)) && <span>{value}</span>}
    </td>
  );
  //#endregion
}
