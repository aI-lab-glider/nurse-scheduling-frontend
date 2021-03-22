/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { WorkerInfoModel } from "../../../common-models/worker-info.model";
import Drawer, { DrawerOptions } from "../../common-components/drawer/drawer.component";
import { WorkerEditComponentMode, WorkerEditComponent } from "../../namestable/worker-edit";
import { WorkerInfoComponent } from "../../namestable/worker-info.component";
import { useWorkerHoursInfo } from "../../schedule-page/table/schedule/use-worker-hours-info";

export enum WorkerDrawerMode {
  EDIT,
  ADD_NEW,
  INFO,
}

export type WorkerDrawerWorkerInfo = Omit<WorkerInfoModel, "time">;
interface WorkerDrawerOptions extends Omit<DrawerOptions, "title"> {
  mode: WorkerDrawerMode;
  worker?: WorkerDrawerWorkerInfo;
}

function getTitle(mode: WorkerDrawerMode): string {
  return {
    [WorkerDrawerMode.EDIT]: "Edycja pracownika",
    [WorkerDrawerMode.ADD_NEW]: "Dodaj pracownika",
    [WorkerDrawerMode.INFO]: "Pracownik",
  }[mode];
}

export default function WorkerDrawerComponent(options: WorkerDrawerOptions): JSX.Element {
  const { mode, worker, setOpen, ...otherOptions } = options;
  const workerRequiredHours = useWorkerHoursInfo(worker?.name ?? "");
  const title = getTitle(mode);
  return (
    <Drawer setOpen={setOpen} title={title} {...otherOptions} data-cy="worker-drawer">
      {
        {
          [WorkerDrawerMode.EDIT]: worker && (
            <WorkerEditComponent
              setOpen={setOpen}
              {...worker}
              time={workerRequiredHours.workerTime}
              mode={WorkerEditComponentMode.EDIT}
            />
          ),
          [WorkerDrawerMode.ADD_NEW]: (
            <WorkerEditComponent
              setOpen={setOpen}
              {...{ name: "", time: 0 }}
              mode={WorkerEditComponentMode.ADD}
            />
          ),
          [WorkerDrawerMode.INFO]: worker && (
            <WorkerInfoComponent {...worker} time={workerRequiredHours.workerTime} />
          ),
        }[mode]
      }
    </Drawer>
  );
}
