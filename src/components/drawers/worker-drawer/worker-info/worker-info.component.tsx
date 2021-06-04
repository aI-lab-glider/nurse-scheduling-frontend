/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Divider } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { colors, fontSizeBase, fontSizeLg } from "../../../../assets/colors";
import { ContractTypeHelper } from "../../../../helpers/contract-type.helper";
import { StringHelper } from "../../../../helpers/string.helper";
import { WorkerTypeHelper } from "../../../../helpers/worker-type.helper";
import { useWorkerHoursInfo } from "../../../../hooks/use-worker-hours-info";
import { useWorkerInfo } from "../../../../hooks/use-worker-info";
import { WorkerName } from "../../../../state/schedule-data/schedule-sensitive-data.model";
import { WorkerType } from "../../../../state/schedule-data/worker-info/worker-info.model";
import { Button } from "../../../common-components";
import WorkersCalendar from "../../../workers-calendar/workers-calendar.component";
import { exportToXlsx } from "./export-to-xlsx";

interface WorkerInfoComponentOptions {
  workerName: WorkerName;
}

export function WorkerInfoComponent({ workerName }: WorkerInfoComponentOptions): JSX.Element {
  const { workerInfo } = useWorkerInfo(workerName);
  const workerHoursInfo = useWorkerHoursInfo(workerName);
  const workerInfoExport = "worker-info-export";
  const calendarExport = "calendar-export";

  const handleExportAsXlsx = (workerInfo, workerHoursInfo): void => {
    const infoSection = {
      "Typ umowy": ContractTypeHelper.translate(workerInfo.contractType),
      "Liczba godzin": workerHoursInfo.workerHourNorm,
      "Liczba nadgodzin": workerHoursInfo.overTime,
      "Suma godzin": workerHoursInfo.workerTime,
    };
    exportToXlsx(workerInfo.workerName, infoSection, workerInfo.workerShifts!);
  };

  const workerLabelColor =
    workerInfo.workerType === WorkerType.NURSE ? colors.nurseColor : colors.babysitterColor;
  return (
    <>
      <Wrapper id={workerInfoExport}>
        <WorkerNameLabel>{StringHelper.capitalizeEach(workerInfo.workerName)}</WorkerNameLabel>
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
          <WorkerInfo>Suma godzin: {workerHoursInfo.workerTime}</WorkerInfo>
          <CalendarDivider data-html2canvas-ignore="true" />
          <ShiftsLabel id="shiftsWord">ZMIANY</ShiftsLabel>
        </div>
        <WorkersCalendar id={calendarExport} workerShifts={workerInfo.workerShifts} />
      </Wrapper>
      <DownloadButton
        variant="primary"
        onClick={(): void => handleExportAsXlsx(workerInfo, workerHoursInfo)}
      >
        Pobierz
      </DownloadButton>
    </>
  );
}

const Wrapper = styled.div``;

const WorkerNameLabel = styled.h2`
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
