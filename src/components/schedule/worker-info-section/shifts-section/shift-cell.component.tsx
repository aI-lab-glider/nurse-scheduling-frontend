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
import { ScheduleError } from "../../../../state/schedule-data/schedule-errors/schedule-error.model";
import {
  ShiftCode,
  SHIFTS,
  ShiftsTypesDict as ShiftTypesDict,
} from "../../../../state/schedule-data/shifts-types/shift-types.model";
import { ColorHelper } from "../../../../helpers/colors/color.helper";
import { ApplicationStateModel } from "../../../../state/application-state.model";
import {
  baseCellDataCy,
  BaseCellOptions,
  hasNextShiftClassName,
  keepOnShiftClassName,
} from "../../base/base-cell/base-cell.models";
import useComponentVisible from "../../../../hooks/use-component-visible";
import useTimeout from "../../../../hooks/use-timeout";
import { CellInput } from "../../base/base-cell/cell-blockable-input.component";
import { ErrorPopper } from "../../../poppers/error-popper/error-popper.component";
import { useCellBackgroundHighlight } from "../../hooks/use-cell-highlight";
import { useCellSelection } from "../../hooks/use-cell-selection";
import { ShiftAutocompleteComponent } from "./shift-autocomplete.component";
import styled from "styled-components";

const MODAL_CLOSE_MS = 4444;

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
    errorSelector = (_): ScheduleError[] => [],
    keepOn,
    hasNext,
  } = options;
  const cellRef = useRef<HTMLDivElement>(null);

  const { componentContainer, isComponentVisible, setIsComponentVisible } = useComponentVisible(
    false
  );

  function toggleComponentVisibility(): void {
    setIsComponentVisible(!isComponentVisible);
  }

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
          margin: "0 0 4px 0px",
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
        {!showInput && (
          <ErrorPopper
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
                  <ShiftBar style={{ backgroundColor: `#${getColor(shiftCode, shiftTypes)}` }} />
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
          </ErrorPopper>
        )}
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

const ShiftBar = styled.div`
  width: 4px;
  height: 100%;
  margin-right: 4px;
  border-radius: 2px 0 0 2px;
`;
