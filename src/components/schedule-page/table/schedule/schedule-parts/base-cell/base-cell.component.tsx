/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import classNames from "classnames/bind";
import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useRef } from "react";
import { usePopper } from "react-popper";
import { Popper } from "./popper";
import { CellDetails } from "./cell-details-content.component";
import { VerboseDate, WeekDay } from "../../../../../../common-models/month-info.model";
import {
  GroupedScheduleErrors,
  ScheduleError,
} from "../../../../../../common-models/schedule-error.model";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../../../../state/models/application-state.model";
import useComponentVisible from "./use-component-visible";
import mergeRefs from "react-merge-refs";
import ErrorListItem from "../../../../validation-drawer/error-list-item.component";
import { ErrorMessageHelper } from "../../../../../../helpers/error-message.helper";
import { CellColorSet } from "../../../../../../helpers/colors/cell-color-set.model";
import { TranslationHelper } from "../../../../../../helpers/translations.helper";
import { ErrorTooltip } from "../error-tooltip.component";
import { BaseCellInputComponent, BaseCellInputOptions } from "./base-cell-input.component";

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
  errorSelector?: (scheduleErrors: GroupedScheduleErrors) => ScheduleError[];
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
  errorSelector,
}: BaseCellOptions): JSX.Element {
  const { year } = useSelector(
    (state: ApplicationStateModel) => state.actualState.temporarySchedule.present.schedule_info);
  const errors = useSelector(
    (state: ApplicationStateModel) => errorSelector?.(state.actualState.scheduleErrors) ?? []
  );
  const dragAnDropType = `${PivotCellType}${sectionKey ?? ""}`;
  const keepOnClass = "keepOn" + keepOn + value;
  const hasNextClass = "hasNext" + hasNext;

  const [isToolTipOpen, setToolTipOpen] = useState(false);

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
      className={classNames("mainCell", { selection: isSelected, blocked: isBlocked })}
      id={getId()}
      onClick={(): void => toggleComponentVisibility()}
      onBlur={(): void => {
        onBlur?.();
      }}
    >
      <ErrorTooltip errorSelector={errorSelector} className="wrapContent">
        <Popper
            ref={cellDetailsPopperRef}
            className="cell-details-popper"
            style={
              usePopper(useRef<HTMLDivElement>(null).current, cellDetailsPopperRef.current).styles
            }
            isOpen={isComponentVisible && isBlocked && value !== ""}
            >
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
          </Popper>
        <div className={"wrapContent"} ref={drag}>
          <div className={"content " + hasNextClass + " " + keepOnClass} data-cy="highlighted-cell">
            {isPointerOn && !isBlocked && (
              <InputComponent
                className="cell-input"
                onValueChange={(value): void => _onValueChange(value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => _onKeyDown(e)}
              />
            )}

            <div className={"leftBorder leftBorderColor"} />
            {(!isPointerOn || (isPointerOn && isBlocked)) && (
              <p
                data-cy="cell"
                className={"relative "}
                onClick={(): void => {
                  if (!isBlocked) onClick?.();
                }}
              >
                {keepOn ? "" : value}
              </p>
            )}
          </div>
        </div>
      </ErrorTooltip>
    </td>
  );
  //#endregion
}
