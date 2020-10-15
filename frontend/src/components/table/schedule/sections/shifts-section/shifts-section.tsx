import { Button } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { StringHelper } from "../../../../../helpers/string.helper";
import { DataRow } from "../../../../../logic/real-schedule-logic/data-row";
import {
  WorkerType,
  WorkerTypeHelper,
} from "../../../../../state/models/schedule-data/employee-info.model";
import { ShiftCode } from "../../../../../state/models/schedule-data/shift-info.model";
import { AddWorkerModal } from "../../../modal/add-worker-modal";
import { ShiftCellComponent } from "../../schedule-parts/shift-cell.component";
import { ScheduleLogicContext } from "../../use-schedule-state";
import { BaseSectionComponent } from "../base-section/base-section.component";
import "./shifts-section.css";
import { ShiftsSectionOptions } from "./shifts-section.options";
import { BaseShiftsSectionComponent } from "../base-shifts-section/base-shifts-section.component";

export function ShiftsSectionComponent(options: ShiftsSectionOptions) {
  const { data = [], workerType } = options;
  const scheduleLogic = useContext(ScheduleLogicContext);

  const [dataState, setDataState] = useState(data);
  const [isOpened, setIsOpened] = useState(false);

  const modal = (
    <AddWorkerModal
      isOpened={isOpened}
      setIsOpened={setIsOpened}
      submit={submit}
      workerType={workerType}
    />
  );

  const sectionKey =
    workerType === WorkerType.NURSE
      ? scheduleLogic?.nurseInfoProvider.sectionKey || ""
      : scheduleLogic?.babysitterInfoProvider.sectionKey || "";

  function addWorker(newRow: DataRow, workerTime: number) {
    scheduleLogic?.addWorker(sectionKey, newRow, workerTime, (newState) =>
      setDataState([...newState])
    );
  }

  function onAddButtonClicked() {
    setIsOpened(true);
  }

  function submit(name: string, time: number) {
    if (data.length > 0) {
      const dataRow = new DataRow(name, new Array(data[0].length - 1).fill(ShiftCode.W));
      addWorker(dataRow, time);
    }
  }

  return (
    <React.Fragment>
      {data.length > 0 && (
        <tr className="section-header">
          <td>
            <h3>{StringHelper.capitalize(WorkerTypeHelper.translate(workerType, true))}</h3>
          </td>

          <td>
            <div className="add-button">
              <Button onClick={onAddButtonClicked}>Dodaj</Button>
            </div>
          </td>
        </tr>
      )}

      <BaseShiftsSectionComponent
        {...options}
        data={dataState}
        sectionKey={sectionKey}
        cellComponent={ShiftCellComponent}
      />
      {modal}
    </React.Fragment>
  );
}
