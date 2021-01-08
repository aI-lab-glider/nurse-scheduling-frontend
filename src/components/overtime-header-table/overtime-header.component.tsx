/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { OvertimeHeaderRow } from "./overtime-header-row.component";

interface OvertimeHeaderTableOptions {
  data: [string, string, string];
}

export function OvertimeHeaderComponent(options: OvertimeHeaderTableOptions): JSX.Element {
  const { data } = options;

  return (
    <div>
      <table className="table" id="overtimeHeaderTable">
        <tbody>
          <OvertimeHeaderRow data={data} />
        </tbody>
      </table>
    </div>
  );
}
