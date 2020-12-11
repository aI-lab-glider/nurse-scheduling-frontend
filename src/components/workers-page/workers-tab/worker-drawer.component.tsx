import React from "react";
import Drawer, { DrawerOptions } from "../../common-components/drawer/drawer.component";
import { WorkerInfoModel } from "../../../common-models/worker-info.model";

export enum WorkerDrawerMode {
  EDIT,
  ADD_NEW,
}

interface WorkerDrawerOptions extends Omit<DrawerOptions, "title"> {
  mode: WorkerDrawerMode;
  worker?: WorkerInfoModel;
}

export default function WorkerDrawerComponent(options: WorkerDrawerOptions): JSX.Element {
  const { mode, worker, setOpen, ...otherOptions } = options;
  const title = mode === WorkerDrawerMode.ADD_NEW ? "Dodaj pracownika" : "Edytuj pracownika";

  return (
    <Drawer setOpen={setOpen} title={title} {...otherOptions}>
      {worker && <h1>{worker.name}</h1>}
    </Drawer>
  );
}
