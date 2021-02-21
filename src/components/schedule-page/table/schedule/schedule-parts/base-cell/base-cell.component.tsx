/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import classNames from "classnames/bind";
import React, { useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import mergeRefs from "react-merge-refs";
import { usePopper } from "react-popper";
import { useSelector } from "react-redux";
import { WeekDay } from "../../../../../../common-models/month-info.model";
import { TranslationHelper } from "../../../../../../helpers/translations.helper";
import { ApplicationStateModel } from "../../../../../../state/models/application-state.model";
import { BaseCellInputComponent } from "./base-cell-input.component";
import {
  BaseCellOptions,
  PivotCellTypePrefix,
  PivotCell,
  CellManagementKeys,
  baseCellDataCy,
} from "./base-cell.models";
import { CellDetails } from "./cell-details-content.component";
import { Popper } from "./popper";
import useComponentVisible from "./use-component-visible";

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
  const dragAnDropType = `${PivotCellTypePrefix}${sectionKey ?? ""}`;
  const errorTriangle = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const keepOnClass = "keepOn" + keepOn + value;
  const hasNextClass = "hasNext" + hasNext;

  const [isToolTipOpen, setToolTipOpen] = useState(false);
  const { styles, attributes } = usePopper(errorTriangle.current, tooltipRef.current);

  const cellDetailsPopperRef = useRef<HTMLDivElement>(null);

  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

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

  function toggleComponentVisibility(): void {
    setIsComponentVisible(!isComponentVisible);
  }
  //  #region view
  return (
    <td
      ref={mergeRefs([ref, drop])}
      className={classNames("mainCell", {
        selection: isSelected || (isComponentVisible && isBlocked),
        blocked: isBlocked,
      })}
      id={getId()}
      onClick={(): void => toggleComponentVisibility()}
      onBlur={(): void => {
        onBlur?.();
      }}
    >
      <div className={"wrapContent"} ref={drag}>
        <div
          className={`content ${hasNextClass} ${keepOnClass}`}
          data-cy={baseCellDataCy(index, "highlighted-cell")}
        >
          {isPointerOn && !isBlocked && (
            <InputComponent
              className={classNames(
                "cell-input",
                `${
                  (value === "U" || value === "L4" || value === "K") && !keepOn ? "moreMargin" : ""
                }`
              )}
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
            ref={cellDetailsPopperRef}
            className="cell-details-popper"
            style={
              usePopper(useRef<HTMLDivElement>(null).current, cellDetailsPopperRef.current).styles
            }
            isOpen={isComponentVisible && isBlocked && value !== ""}
            data={
              <CellDetails
                index={index}
                day={verboseDate?.date || 0}
                month={monthNumber || 0}
                year={year}
                rowIndex={rowIndex}
                shiftcode={value}
                sectionKey={sectionKey}
                close={(): void => setIsComponentVisible(false)}
              />
            }
          />
          <div className={"leftBorder leftBorderColor"} />
          {(!isPointerOn || (isPointerOn && isBlocked)) && (
            <p
              data-cy={baseCellDataCy(index, "cell")}
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
