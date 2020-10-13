import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { DataRowHelper } from "../../../../../helpers/row.helper";
import { StringHelper } from "../../../../../helpers/string.helper";
import { DataRow } from "../../../../../logic/real-schedule-logic/data-row";
import { ShiftsInfoLogic } from "../../../../../logic/real-schedule-logic/shifts-info.logic";
import { WorkerTypeHelper } from "../../../../../state/models/schedule-data/employee-info.model";
import { ShiftCode } from "../../../../../state/models/schedule-data/shift-info.model";
import { AddWorkerModal } from "../../../modal/add-worker-modal";
import { ShiftCellComponent } from "../../schedule-parts/shift-cell.component";
import "./shifts-section.css";
import { ShiftsSectionOptions } from "./shifts-section.options";
import {BaseShiftsSectionComponent} from "../base-shifts-section/base-shifts-section.component";

export function ShiftsSectionComponent(options: ShiftsSectionOptions) {
  const { onSectionUpdated, data = [], workerType, metaDataLogic } = options;
  const logic = new ShiftsInfoLogic(DataRowHelper.dataRowsAsValueDict<ShiftCode>(data, true));

  const [isOpened, setIsOpened] = useState(false);

  const modal = (
    <AddWorkerModal
      isOpened={isOpened}
      setIsOpened={setIsOpened}
      submit={submit}
      workerType={workerType}
    />
  );

  function addDataRow(newRow: DataRow) {
    onSectionUpdated([...logic.sectionData, newRow]);
  }

  function onAddButtonClicked() {
    setIsOpened(true);
  }

  function submit(name: string, time: number) {
    if (data.length > 0) {
      const dataRow = new DataRow(name, new Array(data[0].length - 1).fill(ShiftCode.W));
      addDataRow(dataRow);
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
        data={data}
        onSectionUpdated={onSectionUpdated}
        cellComponent={ShiftCellComponent}
        metaDataLogic={metaDataLogic}
        logic={logic}
      />
      {modal}
    </React.Fragment>
  );
}
