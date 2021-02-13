/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import classNames from "classnames/bind";
import React from "react";
import {
  GroupedScheduleErrors,
  ScheduleError,
} from "../../../../../../common-models/schedule-error.model";
import {
  CellBlockableInputComponent,
  CellBlockableInputComponentOptions,
} from "../cell-blockable-input.component";
import { ErrorTooltipProvider } from "../error-tooltip.component";
import {
  useCellBackgroundHighlight,
  UseCellBackgroundHighlightOptions,
} from "../hooks/use-cell-highlight";
import { useCellSelection, UseCellSelectionOptions } from "../hooks/use-cell-selection";
import { BaseCellInputComponent } from "./base-cell-input.component";

export interface BaseCellOptions
  extends UseCellSelectionOptions,
    UseCellBackgroundHighlightOptions,
    Omit<CellBlockableInputComponentOptions, "input"> {
  rowIndex: number;
  value: string;
  isBlocked: boolean;
  isPointerOn: boolean;
  isSelected: boolean;
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
  onBlur?: () => void;
  sectionKey: string;
  errorSelector?: (scheduleErrors: GroupedScheduleErrors) => ScheduleError[];
}

export function BaseCellComponent(options: BaseCellOptions): JSX.Element {
  const {
    value,
    isBlocked,
    isSelected,
    isPointerOn,
    onClick,
    onBlur,
    errorSelector = (_) => [],
  } = options;

  const selectableItemRef = useCellSelection(options);
  const id = useCellBackgroundHighlight(options);

  //  #region view
  return (
    <td
      ref={selectableItemRef}
      className={classNames("mainCell", { selection: isSelected, blocked: isBlocked })}
      id={id}
      onBlur={onBlur}
    >
      <div
        className="wrapContent"
        onClick={(): void => {
          if (!isBlocked) onClick?.();
        }}
      >
        <CellBlockableInputComponent input={BaseCellInputComponent} {...options} />
        <div className={"content"}>
          {(!isPointerOn || (isPointerOn && isBlocked)) && (
            <ErrorTooltipProvider errorSelector={errorSelector} className={"content"}>
              <p data-cy="cell" className={"relative "}>
                {value}
              </p>
            </ErrorTooltipProvider>
          )}
        </div>
      </div>
    </td>
  );
  //#endregion
}
