import classNames from "classnames/bind";
import React from "react";
import {
  WorkerInfoModel,
  WorkerType,
  WorkerTypeHelper,
} from "../../common-models/worker-info.model";
import { StringHelper } from "../../helpers/string.helper";

export function WorkerInfoComponent(info: WorkerInfoModel): JSX.Element {
  return (
    <>
      <div className={"span-errors"}>
        <div className={"workers-table"}>
          <span
            className={classNames("worker-label", `${info.type?.toString().toLowerCase()}-label`)}
          >
            {StringHelper.capitalize(WorkerTypeHelper.translate(info.type ?? WorkerType.OTHER))}
          </span>
        </div>
        <br />
        <div className={"worker-info"}>
          <p>Typ umowy:</p>
          <p>Ilość godzin: {info.requiredHours}</p>
          <p>Ilość nadgodzin: {info.overtime}</p>
          <p>Suma godzin: {info.time}</p>
        </div>
      </div>
    </>
  );
}
