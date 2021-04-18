/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { WorkerInfoModel } from "../../../state/schedule-data/worker-info/worker-info.model";
import Drawer, { DrawerOptions } from "../drawer/drawer.component";
import { WorkerEditComponent, WorkerEditComponentMode } from "./worker-edit";
import { WorkerInfoComponent } from "./worker-info/worker-info.component";
import { useWorkerHoursInfo } from "../../../hooks/use-worker-hours-info";
import i18next from "i18next";

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
    [WorkerDrawerMode.EDIT]: i18next.t("workerEditing"),
    [WorkerDrawerMode.ADD_NEW]: i18next.t("workerAdd"),
    [WorkerDrawerMode.INFO]: i18next.t("worker"),
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
