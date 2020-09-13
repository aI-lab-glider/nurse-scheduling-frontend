import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ScheduleLogic } from "../../../logic/schedule/schedule.logic";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ShiftCellComponent } from "./cell-components/shift-cell.component";
import "./list.component.css";
import { ScheduleRowComponent } from "./schedule-row.component";

function ListComponent() {
  const uploadedScheduleSheet = useSelector(
    (state: ApplicationStateModel) => state.uploadedScheduleSheet
  );

  const [scheduleLogic, setScheduleLogic] = useState<ScheduleLogic>();

  useEffect(() => {
    if (Object.keys(uploadedScheduleSheet || {}).length !== 0) {
      setScheduleLogic(new ScheduleLogic(uploadedScheduleSheet as Array<Object>));
    }
  }, [uploadedScheduleSheet]);

  return (
    <table className="table">
      <tbody>
        {ScheduleRowComponent(scheduleLogic?.getMetadata().dayNumbersAsDataRow)}

        {ScheduleRowComponent()}

        {scheduleLogic
          ?.getChildrenInfo()
          .sectionData.map((dataRow) => ScheduleRowComponent(dataRow))}

        {ScheduleRowComponent()}

        {scheduleLogic
          ?.getNurseInfo()
          .sectionData.map((dataRow) => ScheduleRowComponent(dataRow, ShiftCellComponent))}

        {ScheduleRowComponent()}

        {scheduleLogic
          ?.getBabySitterInfo()
          .sectionData.map((dataRow) => ScheduleRowComponent(dataRow, ShiftCellComponent))}
      </tbody>
    </table>
  );
}
export default ListComponent;
