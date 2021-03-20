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
    throw new Error("Schedule in dev mode includes error user");
  }
  const arraum = [
    {
      name: "Pielęgniarki",
      type: WorkerType.NURSE,
      data: scheduleLocalState.nurseShiftsSection,
      dataCy: "nurseShiftsTable",
      arePresent: areNursesPresent,
    },
    {
      name: "Opiekunowie",
      type: WorkerType.OTHER,
      data: scheduleLocalState.babysitterShiftsSection,
      dataCy: "otherShiftsTable",
      arePresent: areBabysittersPresent,
    },
  ];
  const ScheduleFoldingComponent = ({ name, type, data, dataCy, arePresent }): JSX.Element => {
    return (
      <ScheduleFoldingSection name={name}>
        {arePresent && (
          <div className="sectionContainer">
            <div>
              <NameTableComponent
                uuid={scheduleLocalState.uuid}
                workerType={type}
                data={data}
                clickable={true}
              />
            </div>
            <div>
              <div>
                <div className="table" data-cy={dataCy}>
                  <ShiftsSectionComponent
                    uuid={scheduleLocalState.uuid}
                    workerType={type}
                    data={data}
                  />
                </div>
              </div>
            </div>
            <div className="summaryContainer">
              <SummaryTableComponent uuid={scheduleLocalState.uuid} data={data} workerType={type} />
            </div>
          </div>
        )}
      </ScheduleFoldingSection>
    );
  };
  return (
    <div style={{ margin: 20 }}>
      <div>
        <div className="sectionContainer">
          <div className="timeTableContainer">
            <TimeTableComponent scheduleLocalState={scheduleLocalState} />
          </div>
          <div className="summaryContainer">
            <OvertimeHeaderComponent data={["norma", "aktualne", "różnica"]} />
          </div>
        </div>
        {arraum.map((item, index) => {
          return <ScheduleFoldingComponent {...item} key={item.name} />;
        })}
        <ScheduleFoldingSection name="Informacje">
          <div className="sectionContainer">
            <div>
              <NameTableComponent
                uuid={scheduleLocalState.uuid}
                data={scheduleLocalState.foundationInfoSection}
                clickable={false}
              />
            </div>
            <div>
              <div>
                <div className="table" data-cy="foundationInfoSection">
                  <FoundationInfoComponent
                    uuid={scheduleLocalState.uuid}
                    data={scheduleLocalState.foundationInfoSection}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScheduleFoldingSection>
      </div>
    </div>
  );
}
