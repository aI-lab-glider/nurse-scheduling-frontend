import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataRow } from "../../../logic/schedule/data-row.logic";
import { ScheduleLogic } from "../../../logic/schedule/schedule.logic";
import { ActionModel } from "../../../state/models/action.model";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ScheduleDataModel } from "../../../state/models/schedule-data/schedule-data.model";
import { ScheduleDataActionType } from "../../../state/reducers/schedule-data.reducer";
import { ShiftCellComponent } from "./cell-components/shift-cell.component";
import "./list.component.css";
import { ScheduleRowComponent } from "./schedule-row.component";

function ListComponent() {
  const uploadedScheduleSheet = useSelector(
    (state: ApplicationStateModel) => state.uploadedScheduleSheet
  );

  const [scheduleLogic, setScheduleLogic] = useState<ScheduleLogic>();

  const scheduleLogicRef = useRef<ScheduleLogic>();
  useEffect(() => {
    if (Object.keys(uploadedScheduleSheet || {}).length !== 0) {
      let logic = new ScheduleLogic(uploadedScheduleSheet as Array<Object>);
      scheduleLogicRef.current = logic;
      setScheduleLogic(logic);
    }
  }, [uploadedScheduleSheet]);

  const dispatcher = useDispatch();
  function onRowUpdate(row: DataRow) {
    scheduleLogicRef.current?.updateRow(row);
    dispatcher({
      type: ScheduleDataActionType.UPDATE,
      payload: scheduleLogicRef.current?.getScheduleModel(),
    } as ActionModel<ScheduleDataModel>);
  }

  return (
    <table className="table">
      <tbody>
        <ScheduleRowComponent
          onRowUpdate={onRowUpdate}
          dataRow={scheduleLogic?.getMetadata().dayNumbersAsDataRow}
        />

        <ScheduleRowComponent />

        {scheduleLogic?.getChildrenInfo().sectionData.map((dataRow, index) => (
          <ScheduleRowComponent
            onRowUpdate={onRowUpdate}
            key={`${dataRow.rowKey}${index}`}
            dataRow={dataRow}
          />
        ))}

        <ScheduleRowComponent />

        {scheduleLogic?.getNurseInfo().sectionData.map((dataRow, index) => (
          <ScheduleRowComponent
            key={`${dataRow.rowKey}${index}`}
            onRowUpdate={onRowUpdate}
            dataRow={dataRow}
            CellComponent={ShiftCellComponent}
          />
        ))}

        <ScheduleRowComponent />

        {scheduleLogic?.getBabySitterInfo().sectionData.map((dataRow, index) => (
          <ScheduleRowComponent
            key={`${dataRow.rowKey}${index}`}
            onRowUpdate={onRowUpdate}
            dataRow={dataRow}
            CellComponent={ShiftCellComponent}
          />
        ))}
      </tbody>
    </table>
  );
}
export default ListComponent;
