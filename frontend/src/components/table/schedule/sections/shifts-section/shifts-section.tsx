import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { DataRowHelper } from "../../../../../helpers/row.helper";
import { StringHelper } from "../../../../../helpers/string.helper";
import { DataRow } from "../../../../../logic/real-schedule-logic/data-row";
import { ShiftsInfoLogic } from "../../../../../logic/real-schedule-logic/shifts-info.logic";
import { WorkerTypeHelper } from "../../../../../state/models/schedule-data/employee-info.model";
import { Shift } from "../../../../../state/models/schedule-data/shift-info.model";
import { ShiftCellComponent } from "../../schedule-parts/shift-cell.component";
import { BaseSectionComponent } from "../base-section/base-section.component";
import "./shifts-section.css";
import { ShiftsSectionOptions } from "./shifts-section.options";
import { AddWorkerModal } from "../../../modal/add-worker-modal";

export function ShiftsSectionComponent({
  workerType,
  data = [],
  metaDataLogic,
  onSectionUpdated,
}: ShiftsSectionOptions) {
  const logic = new ShiftsInfoLogic(DataRowHelper.dataRowsAsValueDict<Shift>(data, true));

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

  function submit(name, time) {
    if (data.length > 0) {
      const dataRow = new DataRow(name, new Array(data[0].length - 1).fill("W"));
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

      <BaseSectionComponent
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
