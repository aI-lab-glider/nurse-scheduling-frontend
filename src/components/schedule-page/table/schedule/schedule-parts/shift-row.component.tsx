/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useMemo } from "react";
import { ShiftCode } from "../../../../../common-models/shift-info.model";
import { DataRow } from "../../../../../logic/schedule-logic/data-row";
import { applyScheduleStyling } from "../../../../common-components/use-schedule-styling/use-schedule-styling";
import { BaseCellOptions } from "./base-cell/base-cell.models";
import { BaseRowComponent } from "./base-row.component";
import { BaseRowOptions } from "./base-row.models";
import { ShiftCellComponent } from "./shift-cell/shift-cell.component";

export interface ShiftRowOptions extends BaseRowOptions {
  dataRow: DataRow;
  onRowUpdated?: (row: DataRow) => void;
  cellComponent?: React.FC<BaseCellOptions>;
}

export function ShiftRowComponent(options: ShiftRowOptions): JSX.Element {
  const { dataRow } = options;
  const styledDataRow = useMemo(() => {
    const data = dataRow.rowData(false) as ShiftCode[];
    const styles = applyScheduleStyling(data).map((styledItem) => ({
      ...styledItem,
      workerName: dataRow.rowKey,
    }));
    return new DataRow(dataRow.rowKey, styles);
  }, [dataRow]);
  return (
    <BaseRowComponent
      {...options}
      dataRow={styledDataRow}
      cellComponent={ShiftCellComponent}
      defaultEmpty={ShiftCode.W}
    />
  );
}
