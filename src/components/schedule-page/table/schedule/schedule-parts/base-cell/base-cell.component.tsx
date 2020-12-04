import React from "react";
import { ColorHelper } from "../../../../../../helpers/colors/color.helper";
import { CellColorSet } from "../../../../../../helpers/colors/cell-color-set.model";
import { BaseCellInputComponent, BaseCellInputOptions } from "./base-cell-input.component";
import { VerboseDate, WeekDay } from "../../../../../../common-models/month-info.model";
import { TranslationHelper } from "../../../../../../helpers/tranlsations.helper";

export enum CellManagementKeys {
  Enter = "Enter",
  Escape = "Escape",
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
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
  onBlur?: () => void;
  input?: React.FC<BaseCellInputOptions>;
  monthNumber?: number;
  verboseDate?: VerboseDate;
}

export function BaseCellComponent({
  index,
  value,
  style = ColorHelper.DEFAULT_COLOR_SET,
  isBlocked,
  isSelected,
  isPointerOn,
  onKeyDown,
  onValueChange,
  onContextMenu,
  onClick,
  onBlur,
  input: InputComponent = BaseCellInputComponent,
  monthNumber,
  verboseDate,
}: BaseCellOptions): JSX.Element {
  function handleContextMenu(e: React.MouseEvent): void {
    e.preventDefault();
    onContextMenu && onContextMenu();
  }
  function _onKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === CellManagementKeys.Enter) {
      onValueChange && onValueChange(e.currentTarget.value);
      return;
    }
    onKeyDown && onKeyDown(e);
  }
  function _onValueChange(newValue: string): void {
    onValueChange && onValueChange(newValue);
  }

  function getId(): string {
    if (verboseDate && monthNumber) {
      if (verboseDate.month !== TranslationHelper.englishMonths[monthNumber]) {
        return "otherMonth";
      }
      if (
        verboseDate.isPublicHoliday ||
        verboseDate.dayOfWeek === WeekDay.SA ||
        verboseDate.dayOfWeek === WeekDay.SU
      ) {
        return "weekend";
      }
    }
    return "thisMonth";
  }
  //  #region view
  return (
    <td
      className="mainCell"
      id={getId()}
      onClick={(): void => {
        !isBlocked && onClick && onClick();
      }}
      onContextMenu={handleContextMenu}
      onBlur={(e): void => {
        onBlur && onBlur();
      }}
    >
      {isPointerOn && !isBlocked && (
        <InputComponent
          className="cell-input"
          onValueChange={(value): void => _onValueChange(value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => _onKeyDown(e)}
        />
      )}
      {(!isPointerOn || (isPointerOn && isBlocked)) && <span>{value}</span>}
    </td>
  );
  //#endregion
}
