import React, { useEffect } from "react";
import { CellColorSet } from "../../../../../../helpers/colors/cell-color-set.model";
import { BaseCellInputComponent, BaseCellInputOptions } from "./base-cell-input.component";
import { VerboseDate, WeekDay } from "../../../../../../common-models/month-info.model";
import { TranslationHelper } from "../../../../../../helpers/tranlsations.helper";
import { useDrag, useDrop } from "react-dnd";
import classNames from "classnames/bind";
import { getEmptyImage } from "react-dnd-html5-backend";

export enum CellManagementKeys {
  Enter = "Enter",
  Escape = "Escape",
}

const PivotCellType = "Cell";
export interface PivotCell {
  type: string;
  rowIndex: number;
  cellIndex: number;
}
export interface BaseCellOptions {
  rowIndex: number;
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
  onDrag?: (pivotCell: PivotCell) => void;
  onDragEnd?: () => void;
  sectionKey: string;
}

export function BaseCellComponent({
  rowIndex,
  index,
  value,
  isBlocked,
  isSelected,
  isPointerOn,
  onKeyDown,
  onValueChange,
  onClick,
  onBlur,
  input: InputComponent = BaseCellInputComponent,
  monthNumber,
  verboseDate,
  onDrag,
  onDragEnd,
  sectionKey,
}: BaseCellOptions): JSX.Element {
  const dragAnDropType = `${PivotCellType}${sectionKey ?? ""}`;
  const [, drop] = useDrop({
    accept: dragAnDropType,
    collect: (monitor) => {
      if (monitor.isOver()) {
        if (!isBlocked) {
          onDrag && onDrag(monitor.getItem() as PivotCell);
        }
      }
    },
    drop: () => {
      onDragEnd && onDragEnd();
    },
  });

  const [, drag, preview] = useDrag({
    item: {
      type: dragAnDropType,
      rowIndex: rowIndex,
      cellIndex: index,
    } as PivotCell,
    end: (item, monitor) => {
      if (!monitor.didDrop()) onDragEnd && onDragEnd();
    },
  });
  // Below lines disable default preview image that is inserted by browser on dragging
  useEffect(() => {
    preview(getEmptyImage());
  }, [preview]);

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
      ref={drop}
      className={classNames("mainCell", { selection: isSelected, blocked: isBlocked })}
      id={getId()}
      onBlur={(): void => {
        onBlur && onBlur();
      }}
    >
      <div className="content" ref={drag}>
        {isPointerOn && !isBlocked && (
          <InputComponent
            className="cell-input"
            onValueChange={(value): void => _onValueChange(value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => _onKeyDown(e)}
          />
        )}

        {(!isPointerOn || (isPointerOn && isBlocked)) && (
          <p
            style={{ position: "relative" }}
            onClick={(): void => {
              !isBlocked && onClick && onClick();
            }}
          >
            {
              value == "N" && <span className="error-triangle" /> //todo change to proper error flag
            }
            {value}
          </p>
        )}
      </div>
    </td>
  );
  //#endregion
}
