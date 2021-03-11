/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import classNames from "classnames/bind";
import React, { useContext, useState } from "react";
import { VerboseDate } from "../../common-models/month-info.model";
import { ScheduleError } from "../../common-models/schedule-error.model";
import { ShiftCode } from "../../common-models/shift-info.model";
import { WorkerInfoModel, WorkerType } from "../../common-models/worker-info.model";
import { ArrayHelper } from "../../helpers/array.helper";
import { Sections } from "../../logic/providers/schedule-provider.model";
import { DataRow } from "../../logic/schedule-logic/data-row";
import { MetadataLogic } from "../../logic/schedule-logic/metadata.logic";
import { ShiftsInfoLogic } from "../../logic/schedule-logic/shifts-info.logic";
import { ErrorTooltipProvider } from "../schedule-page/table/schedule/schedule-parts/error-tooltip-provider.component";
import { BaseSectionOptions } from "../schedule-page/table/schedule/sections/base-section/base-section.component";
import { ScheduleLogicContext } from "../schedule-page/table/schedule/use-schedule-state";

import WorkerDrawerComponent, {
  WorkerDrawerMode,
  WorkerDrawerWorkerInfo,
} from "../workers-page/workers-tab/worker-drawer.component";

export interface NameTableSectionOptions extends Pick<BaseSectionOptions, "errorSelector"> {
  dataRow: DataRow[];
  workerType?: WorkerType;
  clickable: boolean;
}

const initialWorkerInfo: WorkerInfoModel = { name: "", time: 0 };

export function NameTableSection({
  dataRow,
  workerType,
  errorSelector,
  clickable,
}: NameTableSectionOptions): JSX.Element {
  const [open, setIsOpen] = useState(false);
  const [workerInfo, setWorkerInfo] = useState<WorkerDrawerWorkerInfo>(initialWorkerInfo);

  const scheduleLogic = useContext(ScheduleLogicContext);
  const sectionKey: keyof Sections =
    workerType === WorkerType.NURSE ? "NurseInfo" : "BabysitterInfo";

  const shifts = scheduleLogic?.getSection<ShiftsInfoLogic>(sectionKey)?.workerShifts;
  const verboseDates = scheduleLogic?.getSection<MetadataLogic>("Metadata")?.verboseDates;

  function toggleDrawer(open: boolean, name: string): void {
    if (workerType) {
      setIsOpen(open);
      if (open) {
        const workersWithDates = ArrayHelper.zip<NonNullable<VerboseDate>, NonNullable<ShiftCode>>(
          verboseDates,
          shifts?.[name]
        );

        setWorkerInfo({
          name: name,
          type: workerType,
          shifts: workersWithDates,
        });
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
          {data.map((workerName) => {
            return (
              <ErrorTooltipProvider
                key={workerName}
                errorSelector={(scheduleErrors): ScheduleError[] =>
                  errorSelector?.(workerName, 0, scheduleErrors) ?? []
                }
                className={classNames(
                  "nametableRow",
                  clickable ? "pointerCursor" : "defaultCursor"
                )}
                tooltipClassname="nametableRow-error-tooltip"
                showErrorTitle={false}
              >
                <tr
                  key={workerName}
                  onClick={(): void => toggleDrawer(true, workerName)}
                  className={classNames(
                    "nametableRow",
                    clickable ? "pointerCursor" : "defaultCursor"
                  )}
                >
                  <td>
                    <span>{workerName}</span>
                    <span className="underline" />
                  </td>
                </tr>
              </ErrorTooltipProvider>
            );
          })}
        </tbody>
      </table>
      <WorkerDrawerComponent
        open={open}
        onClose={(): void => toggleDrawer(false, "")}
        mode={WorkerDrawerMode.INFO}
        worker={workerInfo}
        setOpen={setIsOpen}
      />
    </React.Fragment>
  );
}
