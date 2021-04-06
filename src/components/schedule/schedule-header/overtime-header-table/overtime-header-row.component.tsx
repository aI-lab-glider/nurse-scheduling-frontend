/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { ArrayHelper } from "../../../../helpers/array.helper";
import { OvertimeHeaderCell } from "./overtime-header-cell.component";

export interface OvertimeHeaderRowOptions {
  data: string[];
}

export function OvertimeHeaderRowF({ data }: OvertimeHeaderRowOptions): JSX.Element {
  return (
    <div className="row" id="summaryRow">
      {data.map((cellData) => {
        return <OvertimeHeaderCell value={cellData} key={cellData} />;
      })}
    </div>
  );
}

export const OvertimeHeaderRow = React.memo(OvertimeHeaderRowF, (prev, next) => {
  return ArrayHelper.arePrimitiveArraysEqual(prev.data, next.data);
});
