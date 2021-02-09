/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { useAutocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";

interface AutocompleteOptions<T> {
  options: T[];
  getOptionLabel: (option: T) => string;
  onValueChange: (newValue: T) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  getOptionColor: (option: T) => string;
  className: string;
}
export function AutocompleteComponent<T>({
  className,
  options,
  getOptionLabel,
  onValueChange,
  onKeyDown,
  getOptionColor,
}: AutocompleteOptions<T>): JSX.Element {
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
    <div data-cy="shiftDropdown">
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
          {...getListboxProps()}
          className={classNames(
            "listbox",
            className.indexOf("moreMargin") > -1 ? "more-left-margin" : ""
          )}
        >
          {groupedOptions.map((option, index) => (
            <li
              {...getOptionProps({ option, index })}
              onClick={(): void => {
                setValue(option);
              }}
            >
              <div className="container">
                <div className="optionLabel" data-cy={option["data-cy"]}>
                  {getOptionLabel(option)}
                </div>
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
