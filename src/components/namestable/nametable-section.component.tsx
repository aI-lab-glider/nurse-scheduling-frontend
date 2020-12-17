import React, { useContext, useState } from "react";
import { DataRow } from "../../logic/schedule-logic/data-row";
import { WorkerInfoModel, WorkerType } from "../../common-models/worker-info.model";
import { Sections } from "../../logic/providers/schedule-provider.model";
import { ScheduleLogicContext } from "../schedule-page/table/schedule/use-schedule-state";
import { ShiftsInfoLogic } from "../../logic/schedule-logic/shifts-info.logic";
import WorkerDrawerComponent, {
  WorkerDrawerMode,
} from "../workers-page/workers-tab/worker-drawer.component";

export interface NameTableCellOptions {
  dataRow: DataRow[];
  workerType?: WorkerType;
}

let workerInfo: WorkerInfoModel = { name: "", time: 0 };

export function NameTableSection({ dataRow, workerType }: NameTableCellOptions): JSX.Element {
  const mode = WorkerDrawerMode.INFO;
  const [open, setIsOpen] = useState(false);

  const scheduleLogic = useContext(ScheduleLogicContext);
  const sectionKey: keyof Sections =
    workerType === WorkerType.NURSE ? "NurseInfo" : "BabysitterInfo";
  const shiftLogic = scheduleLogic?.getSection<ShiftsInfoLogic>(sectionKey);

  function toggleDrawer(open: boolean, name: string): void {
    if (workerType) {
      setIsOpen(open);
      if (open) {
        const [requiredHours, actualHours, overtime] =
          shiftLogic?.calculateWorkerHourInfo(name) ?? [];

        workerInfo = {
          name: name,
          time: actualHours,
          type: workerType,
          requiredHours,
          overtime,
        };
      }
    }
  }

  function getNames(): string[] {
    return dataRow.map((a) => a.rowKey);
  }

  const data = getNames();

  return (
    <React.Fragment>
      <table className="nametable">
        <tbody>
          {data.map((cellData) => {
            return (
              <tr
                key={cellData}
                onClick={(): void => toggleDrawer(true, cellData)}
                className="nametableRow"
              >
                <td>
                  <span>{cellData}</span>
                  <span className="underline"></span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <WorkerDrawerComponent
        open={open}
        onClose={(): void => toggleDrawer(false, "")}
        mode={mode}
        worker={workerInfo}
        setOpen={setIsOpen}
      />
    </React.Fragment>
  );
}
