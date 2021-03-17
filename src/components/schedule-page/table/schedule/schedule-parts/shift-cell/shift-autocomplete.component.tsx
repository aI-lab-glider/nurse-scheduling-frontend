/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { useAutocomplete } from "@material-ui/lab";
import _ from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePopper } from "react-popper";
import { useSelector } from "react-redux";
import { ShiftCode, SHIFTS as shifts } from "../../../../../../common-models/shift-info.model";
import { ApplicationStateModel } from "../../../../../../state/models/application-state.model";
import { BaseCellInputOptions } from "../base-cell/base-cell-input.component";
import classNames from "classnames/bind";

const ShiftCodeSelectItems = _.sortBy(
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
  const { styles } = usePopper(inputRef.current, tooltipRef.current, {
    placement: "right-end",
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

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    options: ShiftCodeSelectItems,
    getOptionLabel,
    open: true,
  });
  const shiftTypes = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present.shift_types
  );

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
        <div className="optionLabel">{getOptionLabel(option)}</div>
        <div className="colorSamplee" style={{ backgroundColor: `#${getOptionColor(option)}` }} />
      </div>
    );
  };
  return (
    <div ref={inputRef} data-cy="shiftDropdown">
      <div {...getRootProps()}>
        <input
          className={inputOptions.className}
          autoFocus={true}
          value={value && getOptionLabel(value)}
          {...getInputProps()}
          onKeyDown={onKeyDown}
        />
      </div>
      {shiftTypes && groupedOptions.length > 0 ? (
        <div
          ref={tooltipRef}
          className={classNames("listbox")}
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
          <div className="autoSeparator" />
          {groupedOptions.map((option, index) => {
            if (option.name.trim() !== shiftTypes[ShiftCode.W].name) {
              if (!option.isWorkingShift) return <LabelComponent option={option} index={index} />;
            }
            return null;
          })}
        </div>
      ) : null}
    </div>
  );
}
