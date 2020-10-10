import React, { useState } from "react";
import { ColorProvider } from "../../../../helpers/colors/color.provider";
import { VerboseDate } from "../../../../logic/real-schedule-logic/month.logic";
import { ShiftCode } from "../../../../state/models/schedule-data/shift-info.model";
import { BaseCellComponent } from "./base-cell.component";
import { CellOptions } from "./cell-options.model";

function getShiftCode(value: string): ShiftCode {
  return ShiftCode[value] || ShiftCode.W;
}
export function ShiftCellComponent(options: CellOptions) {
  const { verboseDate, value, className, onDataChanged, onContextMenu } = options;
  const [shift, setShift] = useState<ShiftCode>(getShiftCode(value));
  const [verboseDateState, setverboseDateState] = useState<VerboseDate | undefined>(verboseDate);

  function onBaseCellUpdate(newShift: string) {
    setShift(getShiftCode(newShift));
    if (onDataChanged) {
      onDataChanged(newShift);
    }
  }

  function toggleFrozenState(index: number, isCellEditable: boolean) {
    if (verboseDate) {
      setverboseDateState({ ...verboseDate, isFrozen: !isCellEditable });
    }
    onContextMenu && onContextMenu(index, verboseDateState?.isFrozen || false);
  }

  return (
    <BaseCellComponent
      {...options}
      value={value === ShiftCode.W ? "" : value}
      className={className}
      style={ColorProvider.getShiftColor(shift, verboseDateState)}
      onDataChanged={onBaseCellUpdate}
      isEditable={verboseDateState?.isFrozen}
      onContextMenu={toggleFrozenState}
    ></BaseCellComponent>
  );
}
