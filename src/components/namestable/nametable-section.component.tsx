/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import classNames from "classnames/bind";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { VerboseDate } from "../../common-models/month-info.model";
import { ScheduleError } from "../../common-models/schedule-error.model";
import { ShiftCode } from "../../common-models/shift-info.model";
import { WorkerInfoModel } from "../../common-models/worker-info.model";
import { ArrayHelper } from "../../helpers/array.helper";
import { DataRow } from "../../logic/schedule-logic/data-row";
import { ApplicationStateModel } from "../../state/models/application-state.model";
import { ErrorTooltipProvider } from "../schedule-page/table/schedule/schedule-parts/error-tooltip-provider.component";
import { BaseSectionOptions } from "../schedule-page/table/schedule/sections/base-section/base-section.component";
import { useMonthInfo } from "../schedule-page/validation-drawer/use-verbose-dates";
import WorkerDrawerComponent, {
  WorkerDrawerMode,
  WorkerDrawerWorkerInfo,
} from "../workers-page/workers-tab/worker-drawer.component";
import { WorkerInfo } from "./use-worker-info";
export interface NameTableSectionOptions extends Pick<BaseSectionOptions, "errorSelector"> {
  data: DataRow[];
  clickable: boolean;
  workerInfo?: WorkerInfo;
}

const initialWorkerInfo: WorkerInfoModel = { name: "", time: 0 };

// TODO: refactor function to be responsible only for rendering of names.
// Code related to worker should not be here
export function NameTableSection({
  data: dataRows,
  errorSelector,
  clickable,
}: NameTableSectionOptions): JSX.Element {
  const [open, setIsOpen] = useState(false);
  const [workerInfo, setWorkerInfo] = useState<WorkerDrawerWorkerInfo>(initialWorkerInfo);
  const { verboseDates } = useMonthInfo();

  const { shifts } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present
  );

  function toggleDrawer(open: boolean, name: string): void {
    if (clickable) {
      setIsOpen(open);
      if (open) {
        const workersWithDates = ArrayHelper.zip<NonNullable<VerboseDate>, NonNullable<ShiftCode>>(
          verboseDates,
          shifts?.[name]
        );

        setWorkerInfo({
          name: name,
          shifts: workersWithDates,
        });
      }
    }
  }

  function getNames(): string[] {
    return dataRows.map((a) => a.rowKey);
  }

  const data = getNames();

  return (
    <React.Fragment>
      <div className="nametable">
        {data.map((workerName) => {
          return (
            <ErrorTooltipProvider
              key={workerName}
              errorSelector={(scheduleErrors): ScheduleError[] =>
                errorSelector?.(workerName, 0, scheduleErrors) ?? []
              }
              className={classNames("nametableRow", clickable ? "pointerCursor" : "defaultCursor")}
              tooltipClassname="nametableRow-error-tooltip"
              showErrorTitle={false}
            >
              <div
                key={workerName}
                onClick={(): void => toggleDrawer(true, workerName)}
                className={classNames(
                  "nametableRow",
                  clickable ? "pointerCursor" : "defaultCursor"
                )}
              >
                <div>
                  <span>{workerName}</span>
                  <span className="underline" />
                </div>
              </div>
            </ErrorTooltipProvider>
          );
        })}
      </div>
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
