/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Divider } from "@material-ui/core";
import classNames from "classnames/bind";
import React from "react";
import { WorkerInfoModel, WorkerTypeHelper } from "../../common-models/worker-info.model";
import { StringHelper } from "../../helpers/string.helper";
import { useWorkerHoursInfo } from "../schedule-page/table/schedule/use-worker-hours-info";
import WorkersCalendar from "../workers-page/workers-calendar/workers-calendar.component";

export function WorkerInfoComponent(info: WorkerInfoModel): JSX.Element {
  const workerHoursInfo = useWorkerHoursInfo(info.name);
  return (
    <>
      <div className={"span-primary workers-table"}>
        <div className={"workers-table"}>
          <p>{StringHelper.capitalizeEach(info.name)}</p>

          {info.type && (
            <span
              className={classNames("worker-label", `${info.type?.toString().toLowerCase()}-label`)}
            >
              {StringHelper.capitalize(WorkerTypeHelper.translate(info.type))}
            </span>
          )}
        </div>
        <br />
        <div className="worker-info">
          <p>Typ umowy:</p>
          <p>Ilość godzin: {workerHoursInfo.workerHourNorm}</p>
          <p>Ilość nadgodzin: {workerHoursInfo.overTime}</p>
          <p>Suma godzin: {info.time}</p>
          <Divider />
          <div id={"zmiany"}>
            <b>ZMIANY</b>
          </div>
        </div>
        <WorkersCalendar shiftsArr={info.shifts!} />
      </div>
    </>
  );
}
