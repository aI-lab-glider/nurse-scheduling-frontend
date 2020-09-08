import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DataRow } from "../../../logic/schedule/data-row.logic";
import { ScheduleLogic } from "../../../logic/schedule/schedule.logic";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { ScheduleRowComponent } from "./schedule-row-component";

function ListComponent() {
  const uploadedScheduleSheet = useSelector(
    (state: ApplicationStateModel) => state.uploadedScheduleSheet
  );
  const [shifts, setShifts] = useState<DataRow[]>([]);

  useEffect(() => {
    if (Object.keys(uploadedScheduleSheet || {}).length != 0) {
      setShifts(
        new ScheduleLogic(uploadedScheduleSheet as Array<Object>).getNurseInfo().asDataRowArray()
      );
    }
  }, [uploadedScheduleSheet]);

  return (
    <table>
      <tbody>{shifts.map((dataRow) => ScheduleRowComponent(dataRow))}</tbody>
    </table>
  );
}
export default ListComponent;
