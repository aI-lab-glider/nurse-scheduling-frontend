/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useState } from "react";
import { CellColorSet } from "../../../../../../helpers/colors/cell-color-set.model";
import { BaseCellInputComponent, BaseCellInputOptions } from "./base-cell-input.component";
import { VerboseDate, WeekDay } from "../../../../../../common-models/month-info.model";
import { TranslationHelper } from "../../../../../../helpers/translations.helper";
import { useDrag, useDrop } from "react-dnd";
import classNames from "classnames/bind";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useRef } from "react";
import { usePopper } from "react-popper";
import { Popper } from "./popper";
import { RightClickPopperContent } from "./right-click-popper-content.component";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../../../../state/models/application-state.model";

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
  keepOn: boolean;
  hasNext: boolean;
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
  keepOn,
  hasNext,
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
  const { year } = useSelector(
    (state: ApplicationStateModel) => state.actualState.temporarySchedule.present.schedule_info
  );
  const dragAnDropType = `${PivotCellType}${sectionKey ?? ""}`;
  const errorTriangle = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const keepOnClass = "keepOn" + keepOn + value;
  const hasNextClass = "hasNext" + hasNext;

  const [isToolTipOpen, setToolTipOpen] = useState(false);
  const { styles, attributes } = usePopper(errorTriangle.current, tooltipRef.current);

  const [showDetails, setShowDetails] = useState(false);
  const rightClickPopperRef = useRef<HTMLDivElement>(null);
  document.addEventListener("click", hideRightClickPopper);

  function showErrorTooltip(): void {
    setToolTipOpen(true);
  }

  function hideErrorTooltip(): void {
    setToolTipOpen(false);
  }

  const [, drop] = useDrop({
    accept: dragAnDropType,
    collect: (monitor) => {
      if (monitor.isOver()) {
        if (!isBlocked) {
          onDrag?.(monitor.getItem() as PivotCell);
        }
      }
    },
    drop: () => {
      onDragEnd?.();
    },
  });
  const [, drag, preview] = useDrag({
    item: {
      type: dragAnDropType,
      rowIndex: rowIndex,
      cellIndex: index,
    } as PivotCell,
    end: (item, monitor) => {
      if (!monitor.didDrop()) onDragEnd?.();
    },
  });
  // Below lines disable default preview image that is inserted by browser on dragging
  useEffect(() => {
    preview(getEmptyImage());
  }, [preview]);

  function _onKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === CellManagementKeys.Enter) {
      onValueChange?.(e.currentTarget.value);
      return;
    }
    onKeyDown?.(e);
  }

  function _onValueChange(newValue: string): void {
    onValueChange?.(newValue);
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

  function displayRightClickPopper(e): void {
    e.preventDefault();
    if (isBlocked) setShowDetails(true);
  }

  function hideRightClickPopper(): void {
    setShowDetails(false);
  }

  //  #region view
  return (
    <td
      ref={drop}
      className={classNames("mainCell", { selection: isSelected, blocked: isBlocked })}
      id={getId()}
      onContextMenu={displayRightClickPopper}
      onClick={hideRightClickPopper}
      onBlur={(): void => {
        onBlur?.();
      }}
    >
      <div className={"wrapContent"} ref={drag}>
        <div className={"content " + hasNextClass + " " + keepOnClass} data-cy="highlighted-cell">
          {isPointerOn && !isBlocked && (
            <InputComponent
              className="cell-input"
              onValueChange={(value): void => _onValueChange(value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => _onKeyDown(e)}
            />
          )}

          <Popper
            ref={tooltipRef}
            className="errorTooltip"
            style={styles}
            {...attributes}
            data={
              <div>
                <h3>{TranslationHelper.polishMonths[monthNumber || 0]}</h3> Błąd w linii: {rowIndex}
                , pozycji: {index}. Wartość komórki: {value}
              </div>
            }
            isOpen={isToolTipOpen}
          />
          <Popper
            ref={rightClickPopperRef}
            className="right-click-popper"
            style={
              usePopper(useRef<HTMLDivElement>(null).current, rightClickPopperRef.current).styles
            }
            isOpen={showDetails}
            data={
              <RightClickPopperContent
                index={index}
                day={verboseDate?.date || 0}
                month={monthNumber || 0}
                year={year}
                rowIndex={rowIndex}
                shift={value}
                sectionKey={sectionKey}
                close={hideRightClickPopper}
              />
            }
          />
          <div className={"leftBorder leftBorderColor"} />
          {(!isPointerOn || (isPointerOn && isBlocked)) && (
            <p
              data-cy="cell"
              className={"relative "}
              onClick={(): void => {
                if (!isBlocked) onClick?.();
              }}
            >
              {
                value === "N" && (
                  <span
                    onMouseEnter={showErrorTooltip}
                    onMouseLeave={hideErrorTooltip}
                    ref={errorTriangle}
                    className="error-triangle"
                  />
                ) //todo change to proper error flag
              }

              {keepOn ? "" : value}
            </p>
          )}
        </div>
      </div>
    </td>
  );
  //#endregion
}
