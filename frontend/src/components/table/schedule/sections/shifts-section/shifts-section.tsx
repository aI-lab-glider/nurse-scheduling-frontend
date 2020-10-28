import { Button } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { StringHelper } from "../../../../../helpers/string.helper";
import { DataRow } from "../../../../../logic/schedule-logic/data-row";
import {
  WorkerType,
  WorkerTypeHelper,
} from "../../../../../state/models/schedule-data/worker-info.model";
import { ShiftCode } from "../../../../../state/models/schedule-data/shift-info.model";
import { AddWorkerModal, WorkerInfo } from "../../../../add-worker-modal/add-worker-modal";
import { ShiftCellComponent } from "../../schedule-parts/shift-cell.component";
import { ScheduleLogicContext } from "../../use-schedule-state";
import { BaseSectionComponent } from "../base-section/base-section.component";
import "./shifts-section.css";
import { ShiftsSectionOptions } from "./shifts-section.options";
import { ShiftRowComponent } from "../../schedule-parts/shift-row.component";

export function ShiftsSectionComponent(options: ShiftsSectionOptions): JSX.Element {
  const { data = [], workerType, uuid } = options;
  const scheduleLogic = useContext(ScheduleLogicContext);
  const [dataState, setDataState] = useState(data);
  useEffect(() => {
    setDataState(data);
  }, [data, uuid]);
  const [isOpened, setIsOpened] = useState(false);
  const [workerInfo, setWorkerInfo] = useState({});

  const modal = (
    <AddWorkerModal
      isOpened={isOpened}
      setIsOpened={setIsOpened}
      submit={submit}
      workerType={workerType}
      workerInfo={workerInfo}
    />
  );

  const sectionInfoProvider =
    workerType === WorkerType.NURSE
      ? scheduleLogic?.nurseInfoProvider
      : scheduleLogic?.babysitterInfoProvider;

  function addOrUpdateWorker(newRow: DataRow, workerTime: number): void {
    if (sectionInfoProvider)
      scheduleLogic?.addWorker(sectionInfoProvider.sectionKey, newRow, workerTime, (newState) =>
        setDataState([...newState])
      );
  }

  function openWorkerModal(workerName?: string): void {
    let workerInfo = {};
    if (workerName && sectionInfoProvider) {
      workerInfo = { name: workerName, time: sectionInfoProvider.workerWorkTime(workerName) };
    }
    setWorkerInfo(workerInfo);
    setIsOpened(true);
  }

  function submit({ name, time }: WorkerInfo): void {
    if (!name || !time) return;
    let dataRow = dataState.find((row) => row.rowKey === name);
    if (!dataRow) {
      dataRow = new DataRow(name, new Array(data[0].length - 1).fill(ShiftCode.W));
    }
    addOrUpdateWorker(dataRow, time || 0);
  }

  return (
    <React.Fragment>
      {dataState.length > 0 && (
        <tr className="section-header">
          <td>
            <h3>{StringHelper.capitalize(WorkerTypeHelper.translate(workerType, true))}</h3>
          </td>

          <td>
            <div className="add-button">
              <Button onClick={(): void => openWorkerModal()}>Dodaj</Button>
            </div>
          </td>
        </tr>
      )}

      <BaseSectionComponent
        {...options}
        key={uuid}
        data={dataState}
        sectionKey={sectionInfoProvider?.sectionKey || ""}
        cellComponent={ShiftCellComponent}
        rowComponent={ShiftRowComponent}
        onRowKeyClicked={(rowIndex): void => openWorkerModal(dataState[rowIndex].rowKey)}
      />
      {modal}
    </React.Fragment>
  );
}
