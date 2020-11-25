import React from "react";
import { ColorHelper } from "../../../../../helpers/colors/color.helper";
import { CellColorSet } from "../../../../../helpers/colors/cell-color-set.model";
import { ShiftCode } from "../../../../../common-models/shift-info.model";
import { createStyles, makeStyles, Popper, TextField, Theme } from "@material-ui/core";
import { useAutocomplete } from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      display: "block",
    },
    listbox: {
      width: 200,
      margin: 0,
      padding: 0,
      zIndex: 1,
      position: "absolute",
      listStyle: "none",
      backgroundColor: theme.palette.background.paper,
      overflow: "auto",
      maxHeight: 200,
      border: "1px solid rgba(0,0,0,.25)",
      '& li[data-focus="true"]': {
        backgroundColor: "#4a8df6",
        color: "white",
        cursor: "pointer",
      },
      "& li:active": {
        backgroundColor: "#2977f5",
        color: "white",
      },
    },
  })
);
interface Opt {
  onKeyDown: (value) => void;
}
function InputWithOptions({ onKeyDown }: Opt) {
  const ShiftCodeTranslation = [
    { name: "rano: 7-15", symbol: "R", code: ShiftCode.R },
    { name: "popołudnie: 15-19", symbol: "P", code: ShiftCode.P },
    { name: "dzień: 7-19", symbol: "D", code: ShiftCode.D },
    { name: "noc: 19-7", symbol: "N", code: ShiftCode.N },
    { name: "dzień + noc: 7-7", symbol: "DN", code: ShiftCode.DN },
    { name: "popołudnie + noc: 15-7", symbol: "PN", code: ShiftCode.PN },
    { name: "wolne", symbol: "W", code: ShiftCode.W },
    { name: "urlop", symbol: "U", code: ShiftCode.U },
    { name: "L4", symbol: "L4", code: ShiftCode.L4 },
  ];
  const classes = useStyles();
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    open: true,
    options: ShiftCodeTranslation,
    getOptionLabel: (option) => option.name,
  });
  return (
    <div>
      <div {...getRootProps()}>
        <input className="cell-input" autoFocus={true} {...getInputProps()} onKeyDown={onKeyDown} />
      </div>
      {groupedOptions.length > 0 ? (
        <ul className={classes.listbox} {...getListboxProps()}>
          {groupedOptions.map((option, index) => (
            <li {...getOptionProps({ option, index })}>{option.name}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
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
  index,
  value,
  style = ColorHelper.DEFAULT_COLOR_SET,
  isBlocked,
  isSelected,
  isPointerOn,
  onKeyDown,
  onContextMenu,
  onClick,
  onBlur,
}: BaseCellOptions) {
  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    onContextMenu && onContextMenu();
  }
  function _onKeyDown(e: React.KeyboardEvent) {
    onKeyDown && onKeyDown(e.currentTarget.nodeValue || value, e);
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
            ? ColorHelper.getHighlightColor().toString()
            : style.backgroundColor.toString(),
      }}
      onKeyDown={_onKeyDown}
      onBlur={(e) => {
        onBlur && onBlur();
      }}
    >
      {isPointerOn && !isBlocked && <InputWithOptions onKeyDown={_onKeyDown} />}

      {(!isPointerOn || (isPointerOn && isBlocked)) && <span>{value}</span>}
    </td>
  );
  //#endregion
}
