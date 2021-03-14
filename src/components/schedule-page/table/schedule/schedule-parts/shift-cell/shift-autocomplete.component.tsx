/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { BaseCellInputOptions } from "../base-cell/base-cell-input.component";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../../../../state/models/application-state.model";
import { Shift, ShiftModel } from "../../../../../../common-models/shift-info.model";
import { AutocompleteComponent } from "../../../../../common-components";

interface ShiftCodeSelectType {
  name: string;
  symbol: string;
  code: string;
  color: string;
  "data-cy": string;
}

const ShiftCodeSelectItems = (shifts: ShiftModel): ShiftCodeSelectType[] =>
  Object.values(shifts).map((shift: Shift) => {
    return {
      name: `${shift.name} ${shift.isWorkingShift ? `(${shift.from}-${shift.to})` : ""}`,
      symbol: shift.code,
      code: shift.code,
      color: shift.color ? shift.color : "$white",
      "data-cy": `autocomplete-${shift.code}`,
    };
  });

export function ShiftAutocompleteComponent(inputOptions: BaseCellInputOptions): JSX.Element {
  const shifts = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present.shift_types
  );
  return (
    <AutocompleteComponent
      className={inputOptions.className}
      options={ShiftCodeSelectItems(shifts)}
      getOptionLabel={(option): string => option.name}
      getOptionColor={(option): string => option.color}
      onValueChange={(option): void => inputOptions.onValueChange(option.code)}
      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => inputOptions.onKeyDown(e)}
    />
  );
}
