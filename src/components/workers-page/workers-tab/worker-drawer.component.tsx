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
  switch (mode) {
    case WorkerDrawerMode.EDIT:
      return "Edycja pracownika";
    case WorkerDrawerMode.ADD_NEW:
      return "Dodaj pracownika";
    case WorkerDrawerMode.INFO:
      return "Pracownik";
  }
}

export default function WorkerDrawerComponent(options: WorkerDrawerOptions): JSX.Element {
  const { mode, worker, setOpen, ...otherOptions } = options;
  const title = getTitle(mode);
  const isInfo = mode === WorkerDrawerMode.INFO;
  return (
    <Drawer setOpen={setOpen} title={title} {...otherOptions}>
      {worker && <WorkerEditComponent {...worker} />}

      {isInfo && WorkerInfoComponent(worker ?? { name: "", time: 0 })}
    </Drawer>
  );
}
