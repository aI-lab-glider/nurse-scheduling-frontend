/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import classNames from "classnames/bind";
import React, { useRef } from "react";
import mergeRefs from "react-merge-refs";
import { usePopper } from "react-popper";
import { useSelector } from "react-redux";
import { ShiftCode } from "../../../../../../common-models/shift-info.model";
import { ApplicationStateModel } from "../../../../../../state/models/application-state.model";
import { baseCellDataCy, BaseCellOptions } from "../base-cell/base-cell.models";
import { CellDetails } from "../base-cell/cell-details-content.component";
import { Popper } from "../base-cell/popper";
import useComponentVisible from "../base-cell/use-component-visible";
import { CellBlockableInputComponent } from "../cell-blockable-input.component";
import { ErrorTooltipProvider } from "../error-tooltip.component";
import { useCellBackgroundHighlight } from "../hooks/use-cell-highlight";
import { useCellSelection } from "../hooks/use-cell-selection";
import { ShiftAutocompleteComponent } from "./shift-autocomplete.component";

function getShiftCode(value: string | number): ShiftCode {
  return typeof value === "number" ? value.toString() : ShiftCode[value] || ShiftCode.W;
}

interface ShiftCellOptions extends BaseCellOptions {
  keepOn?: boolean;
  hasNext?: boolean;
}

export function ShiftCellComponent(options: ShiftCellOptions): JSX.Element {
  const {
    cellIndex,
    value,
    isBlocked,
    isSelected,
    isPointerOn,
    onKeyDown,
    onValueChange,
    onClick,
    onBlur,
    monthNumber,
    verboseDate,
    errorSelector = (_) => [],
    keepOn,
    hasNext,
  } = options;
  const { year } = useSelector(
    (state: ApplicationStateModel) => state.actualState.temporarySchedule.present.schedule_info
  );
  const cellDetailsPopperRef = useRef<HTMLDivElement>(null);
  const { componentContainer, isComponentVisible, setIsComponentVisible } = useComponentVisible(
    false
  );

  function toggleComponentVisibility(): void {
    setIsComponentVisible(!isComponentVisible);
  }

  const shiftCode = getShiftCode(value);
  const keepOnClass = "keepOn" + keepOn + shiftCode;
  const hasNextClass = "hasNext" + hasNext;

  function _onValueChange(inputValue: string): void {
    onValueChange && onValueChange(getShiftCode(inputValue));
  }
  const selectableItemRef = useCellSelection(options);
  const id = useCellBackgroundHighlight(options);

  //  #region view
  return (
    <td
      ref={mergeRefs([selectableItemRef, componentContainer])}
      className={classNames("mainCell", { selection: isSelected, blocked: isBlocked })}
      onClick={(): void => toggleComponentVisibility()}
      id={id}
      onBlur={(): void => {
        onBlur?.();
      }}
    >
      <div
        className="wrapContent"
        onClick={(): void => {
          if (!isBlocked) onClick?.();
        }}
      >
        <Popper
          ref={cellDetailsPopperRef}
          className="cell-details-popper"
          style={
            usePopper(useRef<HTMLDivElement>(null).current, cellDetailsPopperRef.current).styles
          }
          isOpen={isComponentVisible && isBlocked && value !== ""}
        >
          <CellDetails
            index={cellIndex}
            day={verboseDate?.date ?? 0}
            month={monthNumber ?? new Date().getMonth()}
            year={year}
            shiftcode={value}
            {...options}
            close={() => setIsComponentVisible(false)}
          />
        </Popper>

        <CellBlockableInputComponent
          input={ShiftAutocompleteComponent}
          onKeyDown={onKeyDown}
          onValueChange={_onValueChange}
          {...options}
        />
        <div
          className={"content " + hasNextClass + " " + keepOnClass}
          data-cy={baseCellDataCy(cellIndex, "highlighted-cell")}
        >
          {(!isPointerOn || (isPointerOn && isBlocked)) && (
            <ErrorTooltipProvider errorSelector={errorSelector} className={"content"}>
              <div className={"leftBorder leftBorderColor"} />
              <p data-cy={baseCellDataCy(cellIndex, "cell")} className={"relative "}>
                {keepOn || shiftCode === ShiftCode.W ? "" : shiftCode}
              </p>
            </ErrorTooltipProvider>
          )}
        </div>
      </div>
    </td>
  );
}
