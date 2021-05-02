/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { useWorkerHoursInfo } from "../../../../hooks/use-worker-hours-info";
import { SummaryTableCell } from "./summarytable-cell.component";
import { summaryRowDataCy, SummaryTableRowOptions } from "./summarytable-row.models";
import { SectionRow } from "../../base/styled";
import styled from "styled-components";

export function SummaryTableRowF({ workerName, rowIndex }: SummaryTableRowOptions): JSX.Element {
  const workerHours = useWorkerHoursInfo(workerName);
  return (
    <SummaryRow id="summaryRow" data-cy={summaryRowDataCy(rowIndex)}>
      {Object.keys(workerHours).map((key, index) => (
          <SummaryTableCell key={`${key}_${index}`} value={workerHours[key]} cellIndex={index} />
        ))}
    </SummaryRow>
  );
}

export const SummaryTableRow = React.memo(SummaryTableRowF, (prev, next) => prev.workerName === next.workerName);

const SummaryRow = styled(SectionRow)`
  height: 40px;
  width: 130px;
`;
