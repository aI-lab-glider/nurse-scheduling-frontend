import React, { useContext, useEffect, useMemo, useState } from "react";
import { DataRow } from "../../logic/schedule-logic/data-row";
import { WorkerInfoComponent } from "./worker-info.component";
import { Drawer } from "@material-ui/core";
import { WorkerType } from "../../common-models/worker-info.model";
import { Sections } from "../../logic/providers/schedule-provider.model";
import { ScheduleLogicContext } from "../schedule-page/table/schedule/use-schedule-state";
import { ShiftsInfoLogic } from "../../logic/schedule-logic/shifts-info.logic";

export interface NameTableCellOptions {
  dataRow: DataRow[];
  workerType: WorkerType;
}

export interface WorkerInfo {
  name?: string;
  workerType?: WorkerType;
  requiredHours?: number;
  actualHours?: number;
  overtime?: number;
  sumOfHours?: number;
}

export interface ToggleOpenState {
  open: boolean;
  name: string;
}

const workerInfo: WorkerInfo = { name: "" };

export function NameTableSection({ dataRow, workerType }: NameTableCellOptions): JSX.Element {
  const [openState, setOpen] = useState<ToggleOpenState>();

  const scheduleLogic = useContext(ScheduleLogicContext);
  const sectionKey: keyof Sections =
    workerType === WorkerType.NURSE ? "NurseInfo" : "BabysitterInfo";
  const shiftLogic = scheduleLogic?.getSection<ShiftsInfoLogic>(sectionKey);
  console.log(shiftLogic);
  function toggleDrawer(openState: ToggleOpenState): void {
    setOpen(openState);
    if (openState.open) {
      const [requiredHours, actualHours, overtime] =
        shiftLogic?.calculateWorkerHourInfo(openState.name) ?? [];

      workerInfo.name = openState.name;
      workerInfo.workerType = workerType;
      workerInfo.requiredHours = requiredHours;
      workerInfo.actualHours = actualHours;
      workerInfo.overtime = overtime;
      workerInfo.sumOfHours = actualHours + overtime;
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
                onClick={(): void => toggleDrawer({ open: true, name: cellData })}
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
      <Drawer
        open={openState?.open}
        onClose={(): void => toggleDrawer({ open: false, name: "" })}
        anchor={"right"}
      >
        <WorkerInfoComponent
          name={workerInfo.name}
          workerType={workerInfo.workerType}
          requiredHours={workerInfo.requiredHours}
          actualHours={workerInfo.actualHours}
          overtime={workerInfo.overtime}
          sumOfHours={workerInfo.sumOfHours}
        />
      </Drawer>
    </React.Fragment>
  );
}
