import { Button } from "@material-ui/core";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { StringHelper } from "../../../../../../helpers/string.helper";
import { DataRow } from "../../../../../../logic/schedule-logic/data-row";
import {
  WorkerInfoModel,
  WorkerType,
  WorkerTypeHelper,
} from "../../../../../../common-models/worker-info.model";
import { ShiftCode } from "../../../../../../common-models/shift-info.model";
import { ShiftCellComponent } from "../../schedule-parts/shift-cell/shift-cell.component";
import { ScheduleLogicContext } from "../../use-schedule-state";
import { BaseSectionComponent, BaseSectionOptions } from "../base-section/base-section.component";
import { ShiftRowComponent } from "../../schedule-parts/shift-row.component";
import { Sections } from "../../../../../../logic/providers/schedule-provider.model";
import { ShiftsInfoLogic } from "../../../../../../logic/schedule-logic/shifts-info.logic";
import { AddWorkerModal } from "../../../../../common-components";

export interface ShiftsSectionOptions extends BaseSectionOptions {
  workerType: WorkerType;
}

export function ShiftsSectionComponent(options: ShiftsSectionOptions): JSX.Element {
  const { data = [], workerType, uuid } = options;
  const scheduleLogic = useContext(ScheduleLogicContext);
  const sectionKey: keyof Sections =
    workerType === WorkerType.NURSE ? "NurseInfo" : "BabysitterInfo";
  const sectionInfoProvider = scheduleLogic?.getSection<ShiftsInfoLogic>(sectionKey);
  const [isOpened, setIsOpened] = useState(false);
  const [workerInfo, setWorkerInfo] = useState({ name: "", time: 0 });

  const addOrUpdateWorker = useCallback(
    (newRow: DataRow, workerTime: number): void => {
      if (sectionKey) scheduleLogic?.addWorker(sectionKey, newRow, workerTime);
    },
    [scheduleLogic, sectionKey]
  );

  const submit = useCallback(
    ({ name, time }: WorkerInfoModel): void => {
      if (!name || !time) return;
      let dataRow = data.find((row) => row.rowKey === name);
      if (!dataRow) {
        dataRow = new DataRow(name, new Array(data[0].length - 1).fill(ShiftCode.W));
      }
      addOrUpdateWorker(dataRow, time);
    },
    [data, addOrUpdateWorker]
  );

  const modal = useMemo(
    () => (
      <AddWorkerModal
        isOpened={isOpened}
        setIsOpened={setIsOpened}
        submit={submit}
        workerType={workerType}
        workerInfo={workerInfo}
      />
    ),
    [workerType, workerInfo, isOpened, submit]
  );

  const openWorkerModal = useCallback(
    (workerName?: string): void => {
      let workerInfo = { name: "", time: 0 };
      if (workerName && sectionInfoProvider) {
        workerInfo = { name: workerName, time: sectionInfoProvider.workerWorkTime(workerName) };
      }
      setWorkerInfo(workerInfo);
      setIsOpened(true);
    },
    [setWorkerInfo, setIsOpened, sectionInfoProvider]
  );

  return (
    <React.Fragment>
      {data.length > 0 && (
        <tr className="section-header">
          <td>
            <h3>{StringHelper.capitalize(WorkerTypeHelper.translate(workerType, true))}</h3>
          </td>

          <td>
            <div>
              <Button variant="outlined" onClick={(): void => openWorkerModal()}>
                Dodaj
              </Button>
            </div>
          </td>
        </tr>
      )}
      <BaseSectionComponent
        {...options}
        key={uuid}
        data={data}
        sectionKey={sectionKey}
        cellComponent={ShiftCellComponent}
        rowComponent={ShiftRowComponent}
        onRowKeyClicked={(rowIndex): void => openWorkerModal(data[rowIndex].rowKey)}
      />
      {modal}
    </React.Fragment>
  );
}
