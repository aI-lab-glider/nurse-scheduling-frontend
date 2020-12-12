import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../../../state/models/application-state.model";
import { WorkerType } from "../../../../common-models/worker-info.model";
import { ShiftsSectionComponent } from "./sections/shifts-section/shifts-section.component";
import { ScheduleLogicContext, useScheduleState } from "./use-schedule-state";
import { FoundationInfoComponent } from "./sections/foundation-info-section/foundation-info.component";
import { TimeTableComponent } from "../../../timetable/timetable.component";
import { NameTableComponent } from "../../../namestable/nametable.component";
import { SummaryTableComponent } from "../../../summerytable/summarytable.component";
import { TableMiddleLine } from "../../table-middleline";
import { OvertimeHeaderComponent } from "../../../overtime-header-table/overtime-header.component";

export function ScheduleComponent(): JSX.Element {
  const scheduleModel = useSelector((state: ApplicationStateModel) => state.scheduleData.present);

  const { scheduleLogic, scheduleLocalState, setNewSchedule } = useScheduleState(scheduleModel);

  useEffect(() => {
    setNewSchedule(scheduleModel);
  }, [scheduleModel, setNewSchedule]);

  function isPresent(): boolean {
    if (scheduleLocalState.isInitialized) {
      const a = scheduleLocalState.dateSection?.length;
      const b = scheduleLocalState.nurseShiftsSection?.length;
      const c = scheduleLocalState.babysitterShiftsSection?.length;
      if (a && b && b && c && a * b * c) {
        return true;
      }
    }
    return false;
  }

  return (
    <React.Fragment>
      {!isPresent() && (
        <table>
          <tbody>
            <tr>
              <td />
              <td>
                <div className="c" style={{ marginLeft: 126, marginTop: 20 }}>
                  <TimeTableComponent />
                </div>
              </td>
              <td />
            </tr>
          </tbody>
        </table>
      )}
      {isPresent() && (
        <table style={{ margin: 20 }}>
          <tbody>
            <ScheduleLogicContext.Provider value={scheduleLogic}>
              <tr className="sectionContainer">
                <td />
                <td>
                  <TimeTableComponent />
                </td>
                <td className="summaryContainer">
                  <OvertimeHeaderComponent data={["norma", "aktualne", "różnica"]} />
                </td>
              </tr>
              <TableMiddleLine name={"Pielęgniarki"} />
              <tr className="sectionContainer">
                <td>
                  <NameTableComponent
                    uuid={scheduleLocalState.uuid}
                    data={scheduleLocalState.nurseShiftsSection}
                  />
                </td>
                <td>
                  <table>
                    <tbody className="table" id="cyTestedSection">
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
              <TableMiddleLine name={"Opiekunowie"} />
              <tr className="sectionContainer">
                <td>
                  <NameTableComponent
                    uuid={scheduleLocalState.uuid}
                    data={scheduleLocalState.babysitterShiftsSection}
                  />
                </td>
                <td>
                  <table>
                    <tbody className="table">
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
              <TableMiddleLine name={"Informacje"} />
              <tr className="sectionContainer">
                <td>
                  <NameTableComponent
                    uuid={scheduleLocalState.uuid}
                    data={scheduleLocalState.foundationInfoSection}
                  />
                </td>
                <td>
                  <table>
                    <tbody className="table">
                      <FoundationInfoComponent
                        uuid={scheduleLocalState.uuid}
                        data={scheduleLocalState.foundationInfoSection}
                      />
                    </tbody>
                  </table>
                </td>
                <td />
              </tr>
            </ScheduleLogicContext.Provider>
          </tbody>
        </table>
      )}
    </React.Fragment>
  );
}
