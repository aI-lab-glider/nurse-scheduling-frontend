/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import Drawer, { DrawerOptions } from "../../common-components/drawer/drawer.component";
import { WorkerInfoModel } from "../../../common-models/worker-info.model";
import { WorkerInfoComponent } from "../../namestable/worker-info.component";
import { WorkerEditComponent } from "../../namestable/worker-edit.component";

export enum WorkerDrawerMode {
  EDIT,
  ADD_NEW,
  INFO,
}

interface WorkerDrawerOptions extends Omit<DrawerOptions, "title"> {
  mode: WorkerDrawerMode;
  worker?: WorkerInfoModel;
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
  const title = getTitle(mode);
  return (
    <Drawer setOpen={setOpen} title={title} {...otherOptions}>
      {
        {
          [WorkerDrawerMode.EDIT]: worker && <WorkerEditComponent {...worker} />,
          [WorkerDrawerMode.ADD_NEW]: <WorkerEditComponent {...{ name: "", time: 0 }} />,
          [WorkerDrawerMode.INFO]: worker && <WorkerInfoComponent {...worker} />,
        }[mode]
      }
    </Drawer>
  );
}
