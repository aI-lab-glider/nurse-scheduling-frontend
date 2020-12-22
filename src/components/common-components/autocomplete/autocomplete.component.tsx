import { useAutocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";

interface AutocompleteOptions<T> {
  options: T[];
  getOptionLabel: (option: T) => string;
  onValueChange: (newValue: T) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
}
export function AutocompleteComponent<T>({
  className = "",
  options,
  getOptionLabel,
  onValueChange,
  onKeyDown,
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
  debugger;
  return (
    <div>
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
        <ul {...getListboxProps()} className="listbox">
          {groupedOptions.map((option, index) => (
            <li
              {...getOptionProps({ option, index })}
              data-cy={option["data-cy"]}
              onClick={(): void => {
                setValue(option);
              }}
            >
              {getOptionLabel(option)}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
