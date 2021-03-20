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
import { Button } from "../common-components";
import { exportToPdf } from "./export-to-pdf";

export function WorkerInfoComponent(info: WorkerInfoModel): JSX.Element {
  const workerHoursInfo = useWorkerHoursInfo(info.name);
  const workerInfoExport = "worker-info-export";
  const calendarExport = "calendar-export";

  const handleExport = (): void => {
    exportToPdf(info.name, { calendarExport, workerInfoExport });
  };

  return (
    <>
      <div
        className={"span-primary workers-table"}
        style={{
          height: "650px",
        }}
      >
        <div id={workerInfoExport}>
          <div className={"workers-table"}>
            <p>{StringHelper.capitalizeEach(info.name)}</p>

            {info.type && (
              <span
                className={classNames(
                  "worker-label",
                  `${info.type?.toString().toLowerCase()}-label`
                )}
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
            <div data-html2canvas-ignore="true">
              <Divider />
            </div>
            <div id={"shiftsWord"}>
              <b>ZMIANY</b>
            </div>
          </div>
        </div>
        <div
          id={calendarExport}
          style={{
            height: "500px",
          }}
        >
          <WorkersCalendar shiftsArr={info.shifts!} />
        </div>
      </div>
      <Button variant={"primary"} onClick={handleExport}>
        Pobierz
      </Button>
    </>
  );
}
