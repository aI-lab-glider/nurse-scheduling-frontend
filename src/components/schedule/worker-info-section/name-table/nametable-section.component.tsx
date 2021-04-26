/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import classNames from "classnames/bind";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { VerboseDate } from "../../../../state/schedule-data/foundation-info/foundation-info.model";
import { ScheduleError } from "../../../../state/schedule-data/schedule-errors/schedule-error.model";
import { ShiftCode } from "../../../../state/schedule-data/shifts-types/shift-types.model";
import {
  WorkerInfoModel,
  WorkerType,
} from "../../../../state/schedule-data/worker-info/worker-info.model";
import { ArrayHelper } from "../../../../helpers/array.helper";
import { DataRow } from "../../../../logic/schedule-logic/data-row";
import { ApplicationStateModel } from "../../../../state/application-state.model";
import { ErrorPopper } from "../../../poppers/error-popper/error-popper.component";
import { BaseSectionOptions } from "../../base/base-section/base-section.component";
import { useMonthInfo } from "../../../../hooks/use-month-info";
import WorkerDrawerComponent, {
  WorkerDrawerMode,
  WorkerDrawerWorkerInfo,
} from "../../../drawers/worker-drawer/worker-drawer.component";
import { WorkerInfo } from "../../../../hooks/use-worker-info";
import styled from "styled-components";
import { colors, fontSizeXs } from "../../../../assets/colors";

export interface NameTableSectionOptions extends Pick<BaseSectionOptions, "errorSelector"> {
  data: DataRow[];
  isWorker: boolean;
  workerInfo?: WorkerInfo;
}

const initialWorkerInfo: WorkerInfoModel = { name: "", time: 0 };

// TODO: refactor function to be responsible only for rendering of names.
// Code related to worker should not be here
export function NameTableSection({
  data: dataRows,
  errorSelector,
  isWorker,
}: NameTableSectionOptions): JSX.Element {
  const [open, setIsOpen] = useState(false);
  const [workerInfo, setWorkerInfo] = useState<WorkerDrawerWorkerInfo>(initialWorkerInfo);
  const { verboseDates } = useMonthInfo();

  const { shifts } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present
  );

  const { type } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present.employee_info
  );

  function toggleDrawer(open: boolean, name: string): void {
    if (isWorker) {
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
    <>
      <Wrapper>
        {data.map((workerName, index) => {
          const isNurse = type[workerName] === WorkerType.NURSE;
          const isLast = index === data.length - 1;
          const isFirst = index === 0;

          return (
            <ErrorPopper
              key={workerName}
              errorSelector={(scheduleErrors): ScheduleError[] =>
                errorSelector?.(workerName, 0, scheduleErrors) ?? []
              }
              showErrorTitle={false}
            >
              <Row
                key={workerName}
                onClick={(): void => toggleDrawer(true, workerName)}
                className={classNames(
                  "nametableRow",
                  isNurse && isWorker && "nurseMarker",
                  !isNurse && isWorker && "babysitterMarker",
                  isFirst && "isFirst",
                  isLast && "isLast"
                )}
              >
                <LabelWrapper>
                  <span>{workerName}</span>
                </LabelWrapper>
              </Row>
            </ErrorPopper>
          );
        })}
      </Wrapper>
      <WorkerDrawerComponent
        open={open}
        onClose={(): void => toggleDrawer(false, "")}
        mode={WorkerDrawerMode.INFO}
        worker={workerInfo}
        setOpen={setIsOpen}
      />
    </>
  );
}

const Wrapper = styled.div`
  align-items: center;
  padding: 0;
  width: 126px;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  width: 100%;

  font-style: normal;
  font-weight: 500;
  font-size: ${fontSizeXs};

  color: ${colors.primaryTextColor};
  border-bottom: 1px solid ${colors.tableBorderGrey};
  cursor: default;

  &.babysitterMarker {
    border-left: 3px solid ${colors.babysitterColor};
    cursor: pointer;
  }

  &.nurseMarker {
    border-left: 3px solid ${colors.nurseColor};
    cursor: pointer;
  }

  &.isFirst {
    border-top-left-radius: 10px;
  }

  &.isLast {
    border-bottom-left-radius: 10px;
    border-bottom: 0;
  }
`;

const LabelWrapper = styled.div`
  padding: 4px;
`;
