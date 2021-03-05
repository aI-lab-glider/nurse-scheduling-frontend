/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useCallback, useState } from "react";
import { WorkerType } from "../../../../common-models/worker-info.model";
import { ShiftsSectionComponent } from "./sections/shifts-section/shifts-section.component";
import { FoundationInfoComponent } from "./sections/foundation-info-section/foundation-info.component";
import { TimeTableComponent } from "../../../timetable/timetable.component";
import { NameTableComponent } from "../../../namestable/nametable.component";
import { SummaryTableComponent } from "../../../summarytable/summarytable.component";
import { OvertimeHeaderComponent } from "../../../overtime-header-table/overtime-header.component";
import { ScheduleComponentState } from "./schedule-state.model";
import { ScheduleFoldingSection } from "./schedule-parts/schedule-folding-section.component";
import * as Sentry from "@sentry/react";
import { useDispatch } from "react-redux";
import AppErrorModal from "../../../common-components/modal/app-error-modal/app-error.modal.component";
import { ScheduleActionType } from "../../../../state/reducers/month-state/schedule-data/schedule.actions";

interface ScheduleComponentOptions {
  schedule: ScheduleComponentState;
}

export function ScheduleComponent({
  schedule: scheduleLocalState,
}: ScheduleComponentOptions): JSX.Element {
  const dispatch = useDispatch();
  const areNursesPresent = scheduleLocalState.nurseShiftsSection?.length !== 0;
  const areBabysittersPresent = scheduleLocalState.babysitterShiftsSection?.length !== 0;

  const [open, setIsOpen] = useState(false);
  const fallback = useCallback(
    ({ resetError }): JSX.Element => (
      <AppErrorModal onClick={resetError} open={open} setOpen={setIsOpen} />
    ),
    [open, setIsOpen]
  );

  const onError = (): void => {
    setIsOpen(true);
    dispatch({
      type: ScheduleActionType.SET_SCHEDULE_CORRUPTED,
    });
  };

  return (
    <Sentry.ErrorBoundary fallback={fallback} onError={onError}>
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
    </Sentry.ErrorBoundary>
  );
}
