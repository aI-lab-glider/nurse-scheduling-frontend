/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import * as _ from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ShiftCode } from "../../common-models/shift-info.model";
import {
  ContractType,
  WorkerGroup,
  WorkersInfoModel,
  WorkerType,
} from "../../common-models/worker-info.model";
import { ApplicationStateModel } from "../../state/models/application-state.model";
import { WorkerInfoExtendedInterface } from "./worker-edit";

interface UseWorkerInfoReturn {
  workerInfo: WorkerInfo;
  setWorkerInfo: (workerInfo: WorkerInfo) => void;
}
export function useWorkerInfo(workerName: string): UseWorkerInfoReturn {
  const [workerInfo, setWorkerInfo] = useState<WorkerInfo>(new WorkerInfo());
  const getWorkerInfo = <T>(
    state: ApplicationStateModel,
    key: keyof WorkersInfoModel
  ): T | undefined =>
    state.actualState.persistentSchedule.present.employee_info[key]?.[workerName] as T | undefined;
  const workerTime = useSelector((state: ApplicationStateModel) =>
    getWorkerInfo<number>(state, "time")
  );
  const workerType = useSelector((state: ApplicationStateModel) =>
    getWorkerInfo<WorkerType>(state, "type")
  );
  const workerContractType = useSelector((state: ApplicationStateModel) =>
    getWorkerInfo<ContractType>(state, "contractType")
  );
  const workerShifts = useSelector(
    (state: ApplicationStateModel) =>
      state.actualState.persistentSchedule.present.shifts[workerName]
  );
  useEffect(() => {
    const newWorkerInfo = new WorkerInfo(
      workerName,
      workerContractType,
      workerTime,
      workerType,
      workerShifts
    );
    setWorkerInfo(newWorkerInfo);
  }, [workerName, workerContractType, workerTime, workerType, workerShifts]);
  return {
    workerInfo,
    setWorkerInfo,
  };
}

export class WorkerInfo {
  public previousWorkerName: string;
  constructor(
    public workerName: string = "",
    public contractType?: ContractType,
    public workerTime: number = 1,
    public workerType?: WorkerType,
    public workerShifts: ShiftCode[] = [],
    public workerGroup?: WorkerGroup
  ) {
    this.previousWorkerName = workerName;
  }

  public withNewName(newName: string): WorkerInfo {
    const copy = _.cloneDeep(this);
    copy.workerName = newName;
    return copy;
  }

  public withNewWorkerTime(newWorkerTime: number): WorkerInfo {
    const copy = _.cloneDeep(this);
    copy.workerTime = newWorkerTime;
    return copy;
  }

  public withNewContractType(newContractType: ContractType): WorkerInfo {
    const copy = _.cloneDeep(this);
    copy.contractType = newContractType;
    return copy;
  }

  public withNewWorkerType(newWorkerType: WorkerType): WorkerInfo {
    const copy = _.cloneDeep(this);
    copy.workerType = newWorkerType;
    return copy;
  }

  asWorkerInfoExtendedInterface(): WorkerInfoExtendedInterface {
    return {
      prevName: this.previousWorkerName,
      workerName: this.workerName,
      workerType: this.workerType,
      contractType: this.contractType,
      time: this.workerTime,
    };
  }
}
