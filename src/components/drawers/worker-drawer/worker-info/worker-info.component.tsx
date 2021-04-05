/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Divider } from "@material-ui/core";
import classNames from "classnames/bind";
import React from "react";
import {
  ContractTypeHelper,
  WorkerInfoModel,
  WorkerTypeHelper,
} from "../../../../state/models/common-models/worker-info.model";
import { StringHelper } from "../../../../helpers/string.helper";
import { useWorkerHoursInfo } from "../../../../hooks/use-worker-hours-info";
import WorkersCalendar from "../../../../pages/workers-page/workers-calendar/workers-calendar.component";
import { Button } from "../../../common-components";
import { exportToPdf } from "./export-to-pdf";
import { useWorkerInfo } from "../../../../hooks/use-worker-info";

export function WorkerInfoComponent(info: WorkerInfoModel): JSX.Element {
  const workerHoursInfo = useWorkerHoursInfo(info.name);
  const workerInfoExport = "worker-info-export";
  const calendarExport = "calendar-export";

  const handleExport = (): void => {
    exportToPdf(info.name, { calendarExport, workerInfoExport });
  };
  const { workerInfo } = useWorkerInfo(info.name);

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
            {workerInfo.contractType && (
              <p>Typ umowy: {ContractTypeHelper.translate(workerInfo.contractType)}</p>
            )}
            <p>Liczba godzin: {workerHoursInfo.workerHourNorm}</p>
            <p>Liczba nadgodzin: {workerHoursInfo.overTime}</p>
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
      <Button variant={"primary"} onClick={handleExport} className="drawer-bottom-button">
        Pobierz
      </Button>
    </>
  );
}
