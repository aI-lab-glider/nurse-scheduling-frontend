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
import styled from "styled-components";
import { ScheduleError } from "../../../../state/schedule-data/schedule-errors/schedule-error.model";
import {
  ShiftCode,
  SHIFTS,
  ShiftTypesDict,
} from "../../../../state/schedule-data/shifts-types/shift-types.model";
import { ColorHelper } from "../../../../helpers/colors/color.helper";
import { ApplicationStateModel } from "../../../../state/application-state.model";
import { baseCellDataCy, BaseCellOptions } from "../../base/base-cell/base-cell.models";
import useComponentVisible from "../../../../hooks/use-component-visible";
import useTimeout from "../../../../hooks/use-timeout";
import { CellInput } from "../../base/base-cell/cell-blockable-input.component";
import { ErrorPopper } from "../../../poppers/error-popper/error-popper.component";
import { useCellBackgroundHighlight } from "../../hooks/use-cell-highlight";
import { useCellSelection } from "../../hooks/use-cell-selection";
import { ShiftAutocompleteComponent } from "./shift-autocomplete.component";
import { colors, fontSizeBase, fontWeightBold } from "../../../../assets/colors";

const MODAL_CLOSE_MS = 4444;

function getShiftCode(value: string | number): ShiftCode {
  return typeof value === "number" ? value.toString() : ShiftCode[value] || ShiftCode.W;
}

interface ShiftCellOptions extends BaseCellOptions {
  keepOn?: boolean;
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
  } = options;
  const cellRef = useRef<HTMLDivElement>(null);

  const { componentContainer, isComponentVisible, setIsComponentVisible } = useComponentVisible(
    false
  );

  function toggleComponentVisibility(): void {
    setIsComponentVisible(!isComponentVisible);
  }

  const shiftCode = getShiftCode(value);

  function onCellInputValueChanged(inputValue: string): void {
    onValueChange?.(getShiftCode(inputValue));
  }

  const selectableItemRef = useCellSelection(options);
  const backgroundHighlight = useCellBackgroundHighlight(options);

  const [showInput, setShowInput] = useState(isPointerOn && !isBlocked);
  useEffect(() => {
    setShowInput(isPointerOn && !isBlocked);
  }, [isPointerOn, isBlocked]);

  const WrapContentDiv = useCallback(
    ({ children }: { children: ReactNode }) => (
      <ContentWrapper
        onClick={(): void => {
          if (!isBlocked) onClick?.();
        }}
      >
        {children}
      </ContentWrapper>
    ),
    [isBlocked, onClick]
  );
  const { shift_types: shiftTypes } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present
  );
  const theColor = ColorHelper.hexToRgb(getColor(shiftCode, SHIFTS));
  const color = `rgba(${theColor?.r},${theColor?.g},${theColor?.b},0.3)`;
  const { setIsCounting } = useTimeout(MODAL_CLOSE_MS, () => setIsComponentVisible(false));

  const cellStyle: CSSProperties = useMemo(
    () =>
      !SHIFTS[shiftCode].isWorkingShift && shiftCode !== "W"
        ? {
            boxShadow: !keepOn ? `-1px 0 0 0 ${color}` : "",
            margin: "0 0 4px 0px",
            backgroundColor: color,
            color,
          }
        : {},
    [shiftCode, keepOn, color]
  );

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
      <CellWrapper
        ref={mergeRefs([selectableItemRef, componentContainer])}
        className={classNames(backgroundHighlight, {
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
        onBlur={(): void => {
          onBlur?.();
        }}
      >
        {showInput && (
          <WrapContentDiv>
            <CellInput
              input={ShiftAutocompleteComponent}
              onKeyDown={onKeyDown}
              onValueChange={onCellInputValueChanged}
              {...options}
            />
          </WrapContentDiv>
        )}
        {!showInput && (
          <ErrorWrapper errorSelector={errorSelector} showTooltip={!showInput}>
            <WrapContentDiv>
              <Content ref={cellRef} style={cellStyle}>
                {!keepOn && !SHIFTS[shiftCode].isWorkingShift && shiftCode !== "W" && (
                  <ShiftBar style={{ backgroundColor: `#${getColor(shiftCode, shiftTypes)}` }} />
                )}
                <Shift
                  style={{ color: `#${getColor(shiftCode, shiftTypes)}` }}
                  data-cy={baseCellDataCy(cellIndex, "cell")}
                >
                  {keepOn || shiftCode === ShiftCode.W ? "" : shiftCode}
                </Shift>
              </Content>
            </WrapContentDiv>
          </ErrorWrapper>
        )}
        )
      </CellWrapper>
    </>
  );
}

export const ShiftCellComponent = React.memo(
  ShiftCellComponentF,
  (prev, next) =>
    prev.value === next.value &&
    prev.isPointerOn === next.isPointerOn &&
    prev.isSelected === next.isSelected &&
    prev.isBlocked === next.isBlocked &&
    prev.keepOn === next.keepOn &&
    _.isEqual(prev.verboseDate, next.verboseDate)
);

const CellWrapper = styled.div`
  flex: 1 1 auto;
  border-left: 1px solid ${colors.tableBorderGrey};
  align-items: center;
  width: 120%;
  height: 100%;
  cursor: cell;
  padding: 0;
  overflow: hidden;

  &:first-child {
    border-left: 0;
  }

  &.weekend {
    background: ${colors.weekendHeader};
  }

  &.otherMonth {
    background: ${colors.cellOtherMonthBackgroundColor};
    color: ${colors.gray600};
  }

  &.selection {
    border-left: 1px solid white;
    background-color: white;
    outline: white solid 1px;
    box-shadow: 0 4px 7px rgba(16, 32, 70, 0.2), 0 0 7px rgba(16, 32, 70, 0.2);
  }
`;

const ErrorWrapper = styled(ErrorPopper)`
  height: 100%;
  width: 100%;
  padding: 4px 0 4px 0;
`;

const ContentWrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 4px 0 4px 0;
`;

const Content = styled.div`
  display: flex;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
`;

const ShiftBar = styled.div`
  width: 4px;
  height: 100%;
  margin-right: 4px;
  border-radius: 2px 0 0 2px;
`;

const Shift = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin: auto;
  font-size: ${fontSizeBase};
  font-weight: ${fontWeightBold};
  line-height: 20px;
  letter-spacing: 0.75px;
  text-align: center;
  left: -2px;
`;
