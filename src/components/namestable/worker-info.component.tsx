import React, { useContext, useEffect, useState } from "react";
import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { WorkerInfoModel } from "../../common-models/worker-info.model";

export function WorkerInfoComponent(info: WorkerInfoModel): JSX.Element {
  return (
    <>
      <div className={"span-errors"}>
        {info.type}
        <p>Typ umowy:</p>
        <p>Ilość godzin: {info.requiredHours}</p>
        <p>Ilość nadgodzin: {info.overtime}</p>
        <p>Suma godzin: {info.time}</p>
      </div>
    </>
  );
}
