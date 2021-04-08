/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Divider } from "@material-ui/core";
import classNames from "classnames/bind";
import React from "react";
import { WorkerInfoModel } from "../../../../state/schedule-data/worker-info/worker-info.model";
import { ContractTypeHelper } from "../../../../helpers/contract-type.helper";
import { WorkerTypeHelper } from "../../../../helpers/worker-type.helper";
import { StringHelper } from "../../../../helpers/string.helper";
import { useWorkerHoursInfo } from "../../../../hooks/use-worker-hours-info";
import WorkersCalendar from "../../../workers-calendar/workers-calendar.component";
import { Button } from "../../../common-components";
import { exportToPdf } from "./export-to-pdf";
import { useWorkerInfo } from "../../../../hooks/use-worker-info";
import styled from "styled-components";

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
      <DownloadButton variant={"primary"} onClick={handleExport}>
        Pobierz
      </DownloadButton>
    </>
  );
}

const DownloadButton = styled(Button)`
  position: absolute;
  bottom: 74px;
  left: 23px;
`;
