/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useContext } from "react";
import { WorkerType } from "../../common-models/worker-info.model";
import { DataRow } from "../../logic/schedule-logic/data-row";
import { ShiftsInfoLogic } from "../../logic/schedule-logic/shifts-info.logic";
import { ScheduleLogicContext } from "../schedule-page/table/schedule/use-schedule-state";
import { SummaryTableRow } from "./summarytable-row.component";

export interface SummaryTableSectionOptions {
  dataRows: DataRow[];
  workerType: WorkerType;
}

export function SummaryTableSection({
  dataRows,
  workerType,
}: SummaryTableSectionOptions): JSX.Element {
  const scheduleLogic = useContext(ScheduleLogicContext);

  const sectionKey = workerType === WorkerType.NURSE ? "NurseInfo" : "BabysitterInfo";
  const shiftLogic = scheduleLogic?.getSection<ShiftsInfoLogic>(sectionKey);

  return (
    <>
      <table
        className="table"
        id="summaryTable"
        data-cy={`${workerType.toLowerCase()}SummaryTable`}
      >
        <tbody>
          {dataRows.map((dataRow) => {
            return (
              <SummaryTableRow
                key={`${scheduleLogic?.uuid ?? 0}_${dataRow.rowKey}`}
                uuid={scheduleLogic?.uuid ?? "0"}
                data={shiftLogic?.calculateWorkerHourInfo(dataRow.rowKey) ?? []}
              />
            );
          })}
        </tbody>
      </table>
    </>
  );
}
