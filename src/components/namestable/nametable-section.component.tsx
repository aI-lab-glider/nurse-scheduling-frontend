/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useContext, useState } from "react";
import { DataRow } from "../../logic/schedule-logic/data-row";
import { WorkerInfoModel, WorkerType } from "../../common-models/worker-info.model";
import { Sections } from "../../logic/providers/schedule-provider.model";
import { ScheduleLogicContext } from "../schedule-page/table/schedule/use-schedule-state";
import { ShiftsInfoLogic } from "../../logic/schedule-logic/shifts-info.logic";
import WorkerDrawerComponent, {
  WorkerDrawerMode,
} from "../workers-page/workers-tab/worker-drawer.component";
import { MetadataLogic } from "../../logic/schedule-logic/metadata.logic";
import { ArrayHelper } from "../../helpers/array.helper";
import { VerboseDate } from "../../common-models/month-info.model";
import { ShiftCode } from "../../common-models/shift-info.model";
import { BaseSectionOptions } from "../schedule-page/table/schedule/sections/base-section/base-section.component";
import { ErrorTooltip } from "../schedule-page/table/schedule/schedule-parts/error-tooltip.component";
import { ScheduleError } from "../../common-models/schedule-error.model";

export interface NameTableSectionOptions extends Pick<BaseSectionOptions, "errorSelector"> {
  dataRow: DataRow[];
  workerType?: WorkerType;
}

let workerInfo: WorkerInfoModel = { name: "", time: 0 };

export function NameTableSection({
  dataRow,
  workerType,
  errorSelector,
}: NameTableSectionOptions): JSX.Element {
  const mode = WorkerDrawerMode.INFO;
  const [open, setIsOpen] = useState(false);

  const scheduleLogic = useContext(ScheduleLogicContext);
  const sectionKey: keyof Sections =
    workerType === WorkerType.NURSE ? "NurseInfo" : "BabysitterInfo";
  const shiftLogic = scheduleLogic?.getSection<ShiftsInfoLogic>(sectionKey);

  const shifts = scheduleLogic?.getSection<ShiftsInfoLogic>(sectionKey)?.workerShifts;
  const verboseDates = scheduleLogic?.getSection<MetadataLogic>("Metadata")?.verboseDates;

  function toggleDrawer(open: boolean, name: string): void {
    if (workerType) {
      setIsOpen(open);
      if (open) {
        const [requiredHours, actualHours, overtime] =
          shiftLogic?.calculateWorkerHourInfo(name) ?? [];

        const workersWithDates = ArrayHelper.zip<NonNullable<VerboseDate>, NonNullable<ShiftCode>>(
          verboseDates,
          shifts?.[name]
        );

        workerInfo = {
          name: name,
          time: actualHours,
          type: workerType,
          shifts: workersWithDates,
          requiredHours,
          overtime,
        };
      }
    }
  }

  function getNames(): string[] {
    return dataRow.map((a) => a.rowKey);
  }

  const data = getNames();

  return (
    <React.Fragment>
      <table className="nametable">
        <tbody>
          {data.map((cellData) => {
            return (
              <ErrorTooltip
                errorSelector={(scheduleErrors): ScheduleError[] =>
                  errorSelector?.(cellData, 0, scheduleErrors) ?? []
                }
                className="nametableRow"
                showErrorTitle={false}
                errorTriangleOffset={{
                  right: -2,
                  top: 5,
                }}
              >
                <tr
                  key={cellData}
                  onClick={(): void => toggleDrawer(true, cellData)}
                  className="nametableRow"
                >
                  <td>
                    <span>{cellData}</span>
                    <span className="underline" />
                  </td>
                </tr>
              </ErrorTooltip>
            );
          })}
        </tbody>
      </table>
      <WorkerDrawerComponent
        open={open}
        onClose={(): void => toggleDrawer(false, "")}
        mode={mode}
        worker={workerInfo}
        setOpen={setIsOpen}
      />
    </React.Fragment>
  );
}
