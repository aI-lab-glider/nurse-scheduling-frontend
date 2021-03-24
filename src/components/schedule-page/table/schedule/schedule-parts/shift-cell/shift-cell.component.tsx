/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import classNames from "classnames/bind";
import * as _ from "lodash";
import React, {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import mergeRefs from "react-merge-refs";
import { useSelector } from "react-redux";
import { ScheduleError } from "../../../../../../common-models/schedule-error.model";
import {
  ShiftCode,
  SHIFTS,
  ShiftsTypesDict as ShiftTypesDict,
} from "../../../../../../common-models/shift-info.model";
import { ColorHelper } from "../../../../../../helpers/colors/color.helper";
import { ApplicationStateModel } from "../../../../../../state/models/application-state.model";
import {
  baseCellDataCy,
  BaseCellOptions,
  hasNextShiftClassName,
  keepOnShiftClassName,
} from "../base-cell/base-cell.models";
import useComponentVisible from "../base-cell/use-component-visible";
import useTimeout from "../base-cell/use-timeout";
import { CellInput } from "../cell-blockable-input.component";
import { ErrorTooltipProvider } from "../error-tooltip-provider.component";
import { useCellBackgroundHighlight } from "../hooks/use-cell-highlight";
import { useCellSelection } from "../hooks/use-cell-selection";
import { ShiftAutocompleteComponent } from "./shift-autocomplete.component";

const MODAL_CLOSE_MS = 444;

function getShiftCode(value: string | number): ShiftCode {
  return typeof value === "number" ? value.toString() : ShiftCode[value] || ShiftCode.W;
}

interface ShiftCellOptions extends BaseCellOptions {
  keepOn?: boolean;
  hasNext?: boolean;
  workerName?: string;
}

export function getColor(value: string, shifts: ShiftTypesDict): string {
  return Object.values(shifts).filter((s) => s.code === value)[0]?.color ?? "FFD100";
}

/**
 * @description Function component that creates cell containing Details or Autocomplete when in edit mode
 * @param option : ShiftCellOption
 * @returns JSX.Element
 */
export function ShiftCellComponentF(options: ShiftCellOptions): JSX.Element {
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
    // verboseDate,
    // monthNumber,
    errorSelector = (_): ScheduleError[] => [],
    keepOn,
    hasNext,
  } = options;
  // TODO revert cell details
  // const { year } = useSelector(
  //   (state: ApplicationStateModel) => state.actualState.temporarySchedule.present.schedule_info
  // );
  // const cellDetailsPopperRef = useRef<HTMLDivElement>(null);

  const cellRef = useRef<HTMLDivElement>(null);

  const { componentContainer, isComponentVisible, setIsComponentVisible } = useComponentVisible(
    false
  );

  function toggleComponentVisibility(): void {
    setIsComponentVisible(!isComponentVisible);
  }

  // TODO revert cell details
  // const isEditMode = useSelector(
  //   (state: ApplicationStateModel) => state.actualState.mode === ScheduleMode.Edit
  // );

  const shiftCode = getShiftCode(value);
  const keepOnClass = keepOnShiftClassName(keepOn) + shiftCode;
  const hasNextClass = hasNextShiftClassName(hasNext);

  function _onValueChange(inputValue: string): void {
    onValueChange?.(getShiftCode(inputValue));
  }

  const selectableItemRef = useCellSelection(options);
  const id = useCellBackgroundHighlight(options);

  const [showInput, setShowInput] = useState(isPointerOn && !isBlocked);
  useEffect(() => {
    setShowInput(isPointerOn && !isBlocked);
  }, [isPointerOn, isBlocked]);

  // TODO revert cell details
  // const styles = usePopper(cellRef.current, cellDetailsPopperRef?.current, {
  //   placement: "right-start",
  // }).styles.popper;

  const WrapContentDiv = useCallback(
    ({ children }: { children: ReactNode }) => (
      <div
        className="wrapContent"
        onClick={(): void => {
          if (!isBlocked) onClick?.();
        }}
      >
        {children}
      </div>
    ),
    [isBlocked, onClick]
  );
  const { shift_types: shiftTypes } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present
  );
  const theColor = ColorHelper.hexToRgb(getColor(shiftCode, SHIFTS));
  const color = `rgba(${theColor?.r},${theColor?.g},${theColor?.b},0.3)`;
  const { setIsCounting } = useTimeout(MODAL_CLOSE_MS, () => setIsComponentVisible(false));

  const cellStyle: CSSProperties = useMemo(() => {
    return !SHIFTS[shiftCode].isWorkingShift && shiftCode !== "W"
      ? {
          boxShadow: !keepOn ? `-1px 0 0 0 ${color}` : "",
          marginLeft: keepOn ? "0" : "0 0 4px 4px",
          backgroundColor: color,
          color,
        }
      : {};
  }, [shiftCode, keepOn, color]);

  return (
    <>
      {showInput && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 100,
          }}
          onClick={(): void => setIsComponentVisible(false)}
          onWheel={(e: React.WheelEvent<HTMLTableCellElement>): void => {
            setShowInput(false);
          }}
        />
      )}
      <div
        ref={mergeRefs([selectableItemRef, componentContainer])}
        className={classNames("mainCell", {
          selection: isSelected || (isComponentVisible && isBlocked),
          blocked: isBlocked,
        })}
        onClick={(): void => {
          toggleComponentVisibility();
        }}
        onMouseEnter={(): void => {
          setIsCounting(false);
        }}
        onMouseLeave={(): void => {
          setIsCounting(true);
        }}
        id={id}
        onBlur={(): void => {
          onBlur?.();
        }}
      >
        {showInput && (
          <WrapContentDiv>
            <CellInput
              input={ShiftAutocompleteComponent}
              onKeyDown={onKeyDown}
              onValueChange={_onValueChange}
              {...options}
            />
          </WrapContentDiv>
        )}
        <ErrorTooltipProvider
          className="wrapContent"
          errorSelector={errorSelector}
          showTooltip={!showInput}
        >
          <WrapContentDiv>
            <div
              ref={cellRef}
              className={`content ${hasNextClass} ${
                keepOn ? "keepOnTrue" : "keepOnFalse"
              } ${keepOnClass}`}
              style={cellStyle}
              data-cy={baseCellDataCy(cellIndex, "highlighted-cell")}
            >
              {!keepOn && !SHIFTS[shiftCode].isWorkingShift && shiftCode !== "W" && (
                <div
                  style={{ backgroundColor: `#${getColor(shiftCode, shiftTypes)}` }}
                  className={"leftBorder"}
                />
              )}
              <p
                data-cy={baseCellDataCy(cellIndex, "cell")}
                className={"relative "}
                style={{ color: `#${getColor(shiftCode, shiftTypes)}` }}
              >
                {keepOn || shiftCode === ShiftCode.W ? "" : shiftCode}
              </p>
            </div>
          </WrapContentDiv>
        </ErrorTooltipProvider>
        {/* TODO revert cell details
        {!isEditMode && (
          <Popper
            ref={cellDetailsPopperRef}
            className="cell-details-popper"
            style={styles}
            isOpen={isComponentVisible && isBlocked && value !== ""}
          >
            <CellDetails
              index={cellIndex}
              day={verboseDate?.date ?? 0}
              month={monthNumber ?? new Date().getMonth()}
              year={year}
              shiftcode={value}
              {...options}
              close={(): void => setIsComponentVisible(false)}
            />
          </Popper>
        )} */}
        )
      </div>
    </>
  );
}

export const ShiftCellComponent = React.memo(ShiftCellComponentF, (prev, next) => {
  return (
    prev.value === next.value &&
    prev.isPointerOn === next.isPointerOn &&
    prev.isSelected === next.isSelected &&
    prev.isBlocked === next.isBlocked &&
    prev.keepOn === next.keepOn &&
    prev.hasNext === next.hasNext &&
    _.isEqual(prev.verboseDate, next.verboseDate)
  );
});
