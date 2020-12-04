import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { ApplicationStateModel } from "../../state/models/application-state.model";
import {
  ScheduleLogicContext,
  useScheduleState,
} from "../schedule-page/table/schedule/use-schedule-state";
import { SummaryTableRow } from "./summarytable-row.component";
import { DataRow } from "../../logic/schedule-logic/data-row";
import { WorkerType } from "../../common-models/worker-info.model";
import { ShiftsInfoLogic } from "../../logic/schedule-logic/shifts-info.logic";

export interface SummaryTableSectionOptions {
  dataRows: DataRow[];
  workerType: WorkerType;
}

export function SummaryTableSection({
  dataRows,
  workerType,
}: SummaryTableSectionOptions): JSX.Element {
  const scheduleModel = useSelector((state: ApplicationStateModel) => state.scheduleData.present);
  const { scheduleLogic, scheduleLocalState, setNewSchedule } = useScheduleState(scheduleModel);

  const sectionKey = workerType === WorkerType.NURSE ? "NurseInfo" : "BabysitterInfo";
  const shiftLogic = scheduleLogic?.getSection<ShiftsInfoLogic>(sectionKey);

  useEffect(() => {
    setNewSchedule(scheduleModel);
  }, [scheduleModel, setNewSchedule]);

  return (
    <React.Fragment>
      <table className="table" id="summaryTable">
        <tbody>
          <ScheduleLogicContext.Provider value={scheduleLogic}>
            {dataRows.map((dataRow) => {
              return (
                <SummaryTableRow
                  key={`${scheduleLocalState.uuid}_${dataRow.rowKey}`}
                  uuid={scheduleLocalState.uuid}
                  data={shiftLogic?.calculateWorkerHourInfo(dataRow.rowKey) ?? []}
                />
              );
            })}
          </ScheduleLogicContext.Provider>
        </tbody>
      </table>
    </React.Fragment>
  );
}
