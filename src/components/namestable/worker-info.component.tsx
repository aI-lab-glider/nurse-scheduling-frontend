import React, { useContext, useEffect, useState } from "react";
import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { WorkerInfo } from "./nametable-section.component";

export function WorkerInfoComponent(info: WorkerInfo): JSX.Element {
  const { name, workerType, requiredHours, actualHours, overtime, sumOfHours } = info;
  return (
    <>
      <div className={"span-errors"}>
        <h3 className={"error-span-header"}>Pracownik</h3>
        <Divider />
        <p>
          {name}
          <br />
          {workerType}
          <br />
          {actualHours}
          <br />
          {overtime}
          <br />
          {sumOfHours}
          <br />
        </p>
      </div>
    </>
  );
}
