/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { WorkerType } from "../../../../common-models/worker-info.model";
import { ShiftsSectionComponent } from "./sections/shifts-section/shifts-section.component";
import { FoundationInfoComponent } from "./sections/foundation-info-section/foundation-info.component";
import { TimeTableComponent } from "../../../timetable/timetable.component";
import { NameTableComponent } from "../../../namestable/nametable.component";
import { SummaryTableComponent } from "../../../summarytable/summarytable.component";
import { OvertimeHeaderComponent } from "../../../overtime-header-table/overtime-header.component";
import { ScheduleComponentState } from "./schedule-state.model";
import { ScheduleFoldingSection } from "./schedule-parts/schedule-folding-section.component";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../../state/models/application-state.model";

interface ScheduleComponentOptions {
  schedule: ScheduleComponentState;
}

export function ScheduleComponent({
  schedule: scheduleLocalState,
}: ScheduleComponentOptions): JSX.Element {
  const areNursesPresent = scheduleLocalState.nurseShiftsSection?.length !== 0;
  const areBabysittersPresent = scheduleLocalState.babysitterShiftsSection?.length !== 0;

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
    <table style={{ margin: 20 }}>
      <tbody>
        <tr className="sectionContainer">
          <td />
          <td>
            <TimeTableComponent scheduleLocalState={scheduleLocalState} />
          </td>
          <td className="summaryContainer">
            <OvertimeHeaderComponent data={["norma", "aktualne", "różnica"]} />
          </td>
        </tr>
        <ScheduleFoldingSection name="Pielęgniarki">
          {areNursesPresent && (
            <tr className="sectionContainer">
              <td>
                <NameTableComponent
                  uuid={scheduleLocalState.uuid}
                  workerType={WorkerType.NURSE}
                  data={scheduleLocalState.nurseShiftsSection}
                  clickable={true}
                />
              </td>
              <td>
                <table>
                  <tbody className="table" data-cy="nurseShiftsTable">
                    <ShiftsSectionComponent
                      uuid={scheduleLocalState.uuid}
                      workerType={WorkerType.NURSE}
                      data={scheduleLocalState.nurseShiftsSection}
                    />
                  </tbody>
                </table>
              </td>
              <td className="summaryContainer">
                <SummaryTableComponent
                  uuid={scheduleLocalState.uuid}
                  data={scheduleLocalState.nurseShiftsSection}
                  workerType={WorkerType.NURSE}
                />
              </td>
            </tr>
          )}
        </ScheduleFoldingSection>

        <ScheduleFoldingSection name="Opiekunowie">
          {areBabysittersPresent && (
            <tr className="sectionContainer">
              <td>
                <NameTableComponent
                  uuid={scheduleLocalState.uuid}
                  workerType={WorkerType.OTHER}
                  data={scheduleLocalState.babysitterShiftsSection}
                  clickable={true}
                />
              </td>
              <td>
                <table>
                  <tbody className="table" data-cy="otherShiftsTable">
                    <ShiftsSectionComponent
                      uuid={scheduleLocalState.uuid}
                      workerType={WorkerType.OTHER}
                      data={scheduleLocalState.babysitterShiftsSection}
                    />
                  </tbody>
                </table>
              </td>
              <td className="summaryContainer">
                <SummaryTableComponent
                  uuid={scheduleLocalState.uuid}
                  data={scheduleLocalState.babysitterShiftsSection}
                  workerType={WorkerType.OTHER}
                />
              </td>
            </tr>
          )}
        </ScheduleFoldingSection>

        <ScheduleFoldingSection name="Informacje">
          <tr className="sectionContainer">
            <td>
              <NameTableComponent
                uuid={scheduleLocalState.uuid}
                data={scheduleLocalState.foundationInfoSection}
                clickable={false}
              />
            </td>
            <td>
              <table>
                <tbody className="table" data-cy="foundationInfoSection">
                  <FoundationInfoComponent
                    uuid={scheduleLocalState.uuid}
                    data={scheduleLocalState.foundationInfoSection}
                  />
                </tbody>
              </table>
            </td>
            <td />
          </tr>
        </ScheduleFoldingSection>
      </tbody>
    </table>
  );
}
