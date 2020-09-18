import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataRow } from "../../../logic/real-schedule-logic/data-row";
import { ScheduleLogic } from "../../../logic/real-schedule-logic/schedule.logic";
import { ActionModel } from "../../../state/models/action.model";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ScheduleDataModel } from "../../../state/models/schedule-data/schedule-data.model";
import { ScheduleDataActionType } from "../../../state/reducers/schedule-data.reducer";
import { ShiftCellComponent } from "./cell-components/shift-cell.component";
import "./list.component.css";
import { ScheduleRowComponent } from "./schedule-row.component";

function ListComponent() {
  const [scheduleLogic, setScheduleLogic] = useState<ScheduleLogic>();

  const scheduleLogicRef = useRef<ScheduleLogic>();
  const scheduleModel = useSelector((state: ApplicationStateModel) => state.scheduleData);
  useEffect(() => {
    if (scheduleModel?.isNew) {
      const logic = new ScheduleLogic(scheduleModel);
      scheduleLogicRef.current = logic;
      setScheduleLogic(logic);
    }
  }, [scheduleModel]);

  const dispatcher = useDispatch();
  function onRowUpdate(row: DataRow) {
    scheduleLogicRef.current?.updateRow(row);
    dispatcher({
      type: ScheduleDataActionType.UPDATE,
      payload: scheduleLogicRef.current?.getScheduleDataModel(),
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
