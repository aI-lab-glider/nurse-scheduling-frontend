/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { useAutocomplete } from "@material-ui/lab";
import _ from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePopper } from "react-popper";
import { useSelector } from "react-redux";
import {
  ShiftCode,
  ShiftsTypesDict,
} from "../../../../state/schedule-data/shifts-types/shift-types.model";
import { ApplicationStateModel } from "../../../../state/application-state.model";
import { BaseCellInputOptions } from "../../base/base-cell/base-cell-input.component";
import useTimeout from "../../../../hooks/use-timeout";
import styled from "styled-components";
import {
  colors,
  fontFamilyPrimary,
  fontSizeBase,
  fontWeightNormal,
} from "../../../../assets/colors";

const MODAL_CLOSE_MS = 444;
interface ShiftCodeSelectItem {
  name: string;
  symbol: string;
  from: number;
  to: number;
  isWorkingShift?: boolean;
  code: string;
  color: string;
}
const ShiftCodeSelectItems = (shifts: ShiftsTypesDict): ShiftCodeSelectItem[] =>
  _.sortBy(
    Object.values(shifts).map((shift) => {
      return {
        name: `${shift.name} ${shift.isWorkingShift ? `(${shift.from}-${shift.to})` : ""}`,
        symbol: shift.code,
        from: shift.from,
        to: shift.to,
        isWorkingShift: shift!.isWorkingShift,
        code: shift.code,
        color: shift.color ? shift.color : "$white",
        "data-cy": `autocomplete-${shift.code}`,
      };
    }),
    ["from", "to", "name"]
  );

/**
 * @description Input & MaterialAutocomplete component for rendering employees shifts
 * @param inputOptions : BaseCellInputOptions
 * @returns JSX.Element
 */
export function ShiftAutocompleteComponent(inputOptions: BaseCellInputOptions): JSX.Element {
  const inputRef = useRef(null);
  const tooltipRef = useRef(null);
  const { styles, forceUpdate } = usePopper(inputRef.current, tooltipRef.current, {
    placement: "auto",
    strategy: "absolute",
  });
  const onValueChange = useCallback((option): void => inputOptions.onValueChange(option.code), [
    inputOptions,
  ]);
  const getOptionLabel = (option): string => option.name;
  const getOptionColor = (option): string => option.color;
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => inputOptions.onKeyDown(e);
  const [value, setValue] = useState();
  useEffect(() => {
    if (value) {
      onValueChange(value);
    }
  }, [value, onValueChange]);

  const { shift_types: shiftTypes } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present
  );
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    options: ShiftCodeSelectItems(shiftTypes),
    getOptionLabel,
    open: true,
  });

  const [isComponentVisible, setIsComponentVisible] = useState(true);
  const { setIsCounting } = useTimeout(MODAL_CLOSE_MS, () => setIsComponentVisible(false));

  const getNonWorkingShifts = (shift: ShiftCodeSelectItem): ShiftCodeSelectItem | undefined => {
    if (shift.name.trim() !== shiftTypes[ShiftCode.W].name) {
      if (!shift.isWorkingShift) return shift;
    }
  };
  const nonWorkingShifts = groupedOptions.filter(getNonWorkingShifts);
  /**
   * @description Small element for rendering shift info & shift color circle
   * @returns JSX.Element
   */
  const LabelComponent = ({ option, index }): JSX.Element => {
    return (
      <div
        {...getOptionProps({ option, index })}
        data-cy={option["data-cy"]}
        onClick={(e: React.MouseEvent): void => {
          e.stopPropagation();
          setValue(option);
        }}
      >
        <OptionLabel>{getOptionLabel(option)}</OptionLabel>
        <OptionColor style={{ backgroundColor: `#${getOptionColor(option)}` }} />
      </div>
    );
  };
  const pageOffset: number | undefined = document.getElementById("root")?.children[0]?.children[0]
    ?.scrollTop;
  return (
    <div
      ref={inputRef}
      data-cy="shiftDropdown"
      style={{ display: isComponentVisible ? "initial" : "none" }}
      onWheel={(e: React.WheelEvent<HTMLTableCellElement>): void => {
        pageOffset !== document.getElementById("root")?.children[0]?.children[0]?.scrollTop &&
          setIsComponentVisible(false);
      }}
      onMouseEnter={(): void => {
        setIsCounting(false);
      }}
      onMouseLeave={(): void => {
        setIsCounting(true);
      }}
    >
      <div {...getRootProps()}>
        <input
          className={inputOptions.className}
          autoFocus={true}
          value={value && getOptionLabel(value)}
          {...getInputProps()}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
            forceUpdate?.();
            onKeyDown?.(e);
          }}
        />
      </div>
      {shiftTypes && groupedOptions.length > 0 && (
        <ListBox
          ref={tooltipRef}
          style={styles.popper}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onMouseDown={(getListboxProps() as any).onMouseDown}
        >
          {groupedOptions.map((option, index) => {
            if (option.name.trim() === shiftTypes[ShiftCode.W].name) {
              return <LabelComponent option={option} index={index} />;
            }
            return null;
          })}
          {groupedOptions.map((option, index) => {
            if (option.isWorkingShift) {
              return <LabelComponent option={option} index={index} />;
            }
            return null;
          })}
          {nonWorkingShifts.length > 0 && <AutoSeparator />}
          {nonWorkingShifts.map((option, index) => (
            <LabelComponent option={option} index={index} />
          ))}
        </ListBox>
      )}
    </div>
  );
}

const AutoSeparator = styled.div`
  flex: 1;
  width: 90%;
  background-color: ${colors.gray400};
  height: 1.25px;
  display: flex;
  align-self: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const ListBox = styled.div`
  position: absolute;
  padding: 10px 0;
  margin: -5px 0 0 -2px;
  overflow: auto;
  font-family: ${fontFamilyPrimary};
  font-size: ${fontSizeBase}rem;
  text-align: left;
  color: ${colors.primary};
  background-color: ${colors.white};
  font-weight: ${fontWeightNormal};
  box-shadow: 0 4px 7px rgba(16, 32, 70, 0.2);
  max-height: 500px;
  border-radius: 7px;
  min-width: 260px;
  z-index: 300;

  & > div {
    display: flex;
    margin-left: 0.6em;
    flex: 1;
    flex-direction: row;
    flex-wrap: nowrap;
    letter-spacing: 0.75px;
    align-content: center;
    justify-items: center;
    justify-content: left;
    &:hover {
      cursor: pointer;
    }
    &[data-focus="true"] {
      cursor: pointer;
    }
  }
`;

const OptionLabel = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-right: 0.2em;
  word-wrap: normal;
  overflow-wrap: normal;
`;
const OptionColor = styled.div`
  display: flex;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  margin: 0 0;
  align-self: center;
`;
