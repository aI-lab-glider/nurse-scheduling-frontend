/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { useSelector } from "react-redux";
import { WorkerHourInfo } from "../../helpers/worker-hours-info.model";
import { useWorkerGroups } from "../../hooks/use-worker-groups";
import { ApplicationStateModel } from "../../state/application-state.model";
import { FoundationInfoComponent } from "./foundation-info-section/foundation-info.component";
import { ScheduleFoldingSection } from "./schedule-folding-section.component";
import { OvertimeHeaderComponent } from "./schedule-header/overtime-header-table/overtime-header.component";
import { TimeTableComponent } from "./schedule-header/timetable/timetable.component";
import { WorkerInfoSection } from "./worker-info-section/worker-info-section.component";
import { SectionContainer } from "./base/styled";
import styled from "styled-components";
import { colors } from "../../assets/colors";

export function ScheduleComponent(): JSX.Element {
  const workerGroups = useWorkerGroups();

  const { time } = useSelector(
    (state: ApplicationStateModel) => state.actualState.persistentSchedule.present.employee_info
  );

  // Only for testing purposes
  if (
    process.env.REACT_APP_TEST_MODE &&
    Object.keys(time)
      .map((worker) => worker.toLowerCase())
      .includes(process.env.REACT_APP_ERROR_WORKER ?? "ERROR")
  ) {
    throw new Error("[TEST MODE] Error user was added");
  }

  return (
    <div style={{ margin: "20 0" }}>
      <div>
        <TimeHeader>
          <TimeTableContainer>
            <TimeTableComponent />
          </TimeTableContainer>
          <SummaryContainer>
            <OvertimeHeaderComponent data={Object.values(WorkerHourInfo.summaryTranslations)} />
          </SummaryContainer>
        </TimeHeader>

        {Object.entries(workerGroups).map(([groupName, workers], index) => (
          <ScheduleFoldingSection name={groupName} key={groupName}>
            <WorkerInfoSection sectionIndex={index} data={workers} sectionName={groupName} />
          </ScheduleFoldingSection>
        ))}

        <ScheduleFoldingSection name="Informacje">
          <FoundationInfoComponent />
        </ScheduleFoldingSection>
      </div>
    </div>
  );
}
const TimeHeader = styled.div`
  display: flex;
  flex-direction: row;
  position: sticky;

  top: 52px;
  z-index: 3;
  flex: 1;
  padding-top: 19px;
  width: 1500px;
`;

const TimeTableContainer = styled.div`
  margin-left: 128px;
`;
const SummaryContainer = styled.div`
  margin-left: 32px;
`;
