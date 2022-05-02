/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import _ from "lodash";
import * as S from "./worker-info.styled";
import { ContractTypeHelper } from "../../../../helpers/contract-type.helper";
import { StringHelper } from "../../../../helpers/string.helper";
import { useWorkerHoursInfo } from "../../../../hooks/use-worker-hours-info";
import { useWorkerInfo, WorkerInfo } from "../../../../hooks/use-worker-info";
import { WorkerName } from "../../../../state/schedule-data/schedule-sensitive-data.model";
import WorkersCalendar from "../../../workers-calendar/workers-calendar.component";
import { exportToXlsx } from "./export-to-xlsx";
import { useMonthInfo } from "../../../../hooks/use-month-info";
import { ShiftCode } from "../../../../state/schedule-data/shifts-types/shift-types.model";
import { WorkerHourInfoSummary } from "../../../../logic/schedule-logic/worker-hours-info.logic";
import { t } from "../../../../helpers/translations.helper";
import { WorkerTypeLabel } from "../../../schedule/worker-info-section/WorkerTypeLabel/WorkerTypeLabel";

interface WorkerInfoComponentOptions {
  workerName: WorkerName;
}

export function WorkerInfoComponent({ workerName }: WorkerInfoComponentOptions): JSX.Element {
  const { workerInfo } = useWorkerInfo(workerName);
  const workerHoursInfo = useWorkerHoursInfo(workerName);
  const workerInfoExport = "worker-info-export";
  const calendarExport = "calendar-export";
  const { verboseDates } = useMonthInfo();

  const handleExportAsXlsx = (
    workerInfoForXlsx: WorkerInfo,
    workerHoursInfoForXlsx: WorkerHourInfoSummary,
    workerShifts: ShiftCode[]
  ): void => {
    const infoSection = {
      contractType: ContractTypeHelper.translate(workerInfoForXlsx.contractType),
      workerHourNorm: workerHoursInfoForXlsx.workerHourNorm,
      overTime: workerHoursInfoForXlsx.overTime,
      workerTime: workerHoursInfoForXlsx.workerTime,
    };
    const shiftsArr = _.zip(verboseDates, workerShifts);
    exportToXlsx(workerInfoForXlsx.workerName, infoSection, shiftsArr);
  };

  return (
    <S.WorkerInfoContainer id={workerInfoExport}>
      <S.HeaderRow>
        <S.NameLabelRow>
          <S.WorkerNameLabel>
            {StringHelper.capitalizeEach(workerInfo.workerName)}
          </S.WorkerNameLabel>
          <WorkerTypeLabel style={{ marginLeft: "10px" }} workerType={workerInfo.workerType} />
        </S.NameLabelRow>

        <S.DownloadButton
          variant="primary"
          onClick={(): void =>
            handleExportAsXlsx(workerInfo, workerHoursInfo, workerInfo.workerShifts)
          }
        >
          {t("downloadWorkerSchedule")}
        </S.DownloadButton>
      </S.HeaderRow>

      {workerInfo.contractType && (
        <S.WorkerInfo>
          {t("contractTypeExportHeader")}:
          <S.BoldInfo>
            {ContractTypeHelper.translate(workerInfo.contractType)} 1/
            {workerInfo.workerTime}
          </S.BoldInfo>
        </S.WorkerInfo>
      )}
      <S.WorkerInfo>
        {t("workerHourNorm")}: <S.BoldInfo>{workerHoursInfo.workerHourNorm}</S.BoldInfo>
      </S.WorkerInfo>
      <S.WorkerInfo>
        {t("overTime")}: <S.OvertimeHours>{workerHoursInfo.overTime}</S.OvertimeHours>
      </S.WorkerInfo>
      <S.WorkerInfo>
        {t("workerTime")}: <S.BoldInfo>{workerHoursInfo.workerTime}</S.BoldInfo>
      </S.WorkerInfo>

      <WorkersCalendar id={calendarExport} workerShifts={workerInfo.workerShifts} />
    </S.WorkerInfoContainer>
  );
}
