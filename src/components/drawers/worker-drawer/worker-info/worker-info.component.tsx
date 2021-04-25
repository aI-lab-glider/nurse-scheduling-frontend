/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Divider } from "@material-ui/core";
import React from "react";
import {
  WorkerInfoModel,
  WorkerType,
} from "../../../../state/schedule-data/worker-info/worker-info.model";
import { ContractTypeHelper } from "../../../../helpers/contract-type.helper";
import { WorkerTypeHelper } from "../../../../helpers/worker-type.helper";
import { StringHelper } from "../../../../helpers/string.helper";
import { useWorkerHoursInfo } from "../../../../hooks/use-worker-hours-info";
import WorkersCalendar from "../../../workers-calendar/workers-calendar.component";
import { Button } from "../../../common-components";
import { exportToPdf } from "./export-to-pdf";
import { useWorkerInfo } from "../../../../hooks/use-worker-info";
import styled from "styled-components";
import { colors, fontSizeBase, fontSizeLg } from "../../../../assets/colors";

export function WorkerInfoComponent(info: WorkerInfoModel): JSX.Element {
  const workerHoursInfo = useWorkerHoursInfo(info.name);
  const workerInfoExport = "worker-info-export";
  const calendarExport = "calendar-export";

  const handleExport = (): void => {
    exportToPdf(info.name, { calendarExport, workerInfoExport });
  };
  const { workerInfo } = useWorkerInfo(info.name);

  const workerLabelColor =
    workerInfo.workerType === WorkerType.NURSE ? colors.nurseColor : colors.babysitterColor;
  return (
    <>
      <Wrapper>
        <WorkerName>{StringHelper.capitalizeEach(info.name)}</WorkerName>
        {workerInfo.workerType && (
          <WorkerTypeLabel color={workerLabelColor}>
            {StringHelper.capitalize(WorkerTypeHelper.translate(workerInfo.workerType))}
          </WorkerTypeLabel>
        )}
        <div>
          {workerInfo.contractType && (
            <WorkerInfo>
              Typ umowy: {ContractTypeHelper.translate(workerInfo.contractType)}
            </WorkerInfo>
          )}
          <WorkerInfo>Liczba godzin: {workerHoursInfo.workerHourNorm}</WorkerInfo>
          <WorkerInfo>Liczba nadgodzin: {workerHoursInfo.overTime}</WorkerInfo>
          <WorkerInfo>Suma godzin: {info.time}</WorkerInfo>
          <CalendarDivider />
          <ShiftsLabel>ZMIANY</ShiftsLabel>
        </div>
        <WorkersCalendar shiftsArr={info.shifts!} />
      </Wrapper>
      <DownloadButton variant={"primary"} onClick={handleExport}>
        Pobierz
      </DownloadButton>
    </>
  );
}

const Wrapper = styled.div``;

const WorkerName = styled.h2`
  font-size: ${fontSizeLg};
  font-weight: 700;
`;
const WorkerTypeLabel = styled.p`
  border-radius: 20px;
  letter-spacing: 0.025em;
  background-color: ${({ color }): string | undefined => color};
  padding: 6px;
  width: 100px;
  text-align: center;
`;

const CalendarDivider = styled(Divider)`
  margin: 20px 0;
`;

const WorkerInfo = styled.p`
  margin-bottom: 0;
`;

const ShiftsLabel = styled.h3`
  font-size: ${fontSizeBase};
  font-weight: 700;
`;

const DownloadButton = styled(Button)`
  position: absolute;
  bottom: 74px;
  left: 23px;
`;
