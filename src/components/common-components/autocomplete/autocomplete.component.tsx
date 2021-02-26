/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { useAutocomplete } from "@material-ui/lab";
import classNames from "classnames/bind";
import React, { useEffect, useRef, useState } from "react";
import { usePopper } from "react-popper";

interface AutocompleteOptions<T> {
  options: T[];
  getOptionLabel: (option: T) => string;
  onValueChange: (newValue: T) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  getOptionColor: (option: T) => string;
  className: string;
}
/**
 * Creates a dropdown with value set to options.
 * Important!
 * Dropdown create by this function is always opened.
 * To close the dropdown, you should destroy this component
 */
export function AutocompleteComponent<T>({
  className,
  options,
  getOptionLabel,
  onValueChange,
  onKeyDown,
  getOptionColor,
}: AutocompleteOptions<T>): JSX.Element {
  const inputRef = useRef(null);
  const tooltipRef = useRef(null);
  const { styles } = usePopper(inputRef.current, tooltipRef.current, {
    placement: "right-end",
  });

  const [value, setValue] = useState<T>();
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
    options,
    getOptionLabel,
    open: true,
  });
  return (
    <div ref={inputRef} data-cy="shiftDropdown">
      <div {...getRootProps()}>
        <input
          className={className}
          autoFocus={true}
          value={value && getOptionLabel(value)}
          {...getInputProps()}
          onKeyDown={onKeyDown}
        />
      </div>
      {groupedOptions.length > 0 ? (
        <ul
          ref={tooltipRef}
          className={classNames("listbox")}
          style={styles.popper}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onMouseDown={(getListboxProps() as any).onMouseDown}
        >
          {groupedOptions.map((option, index) => (
            <li
              {...getOptionProps({ option, index })}
              data-cy={option["data-cy"]}
              onClick={(e: React.MouseEvent): void => {
                e.stopPropagation();
                setValue(option);
              }}
            >
              <div className="container">
                <div className="optionLabel">{getOptionLabel(option)}</div>
                <div
                  className="colorSample"
                  style={{ backgroundColor: `#${getOptionColor(option)}` }}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
