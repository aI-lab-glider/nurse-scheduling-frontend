/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { useSelector } from "react-redux";
import { DataRow } from "../../../logic/schedule-logic/data-row";
import { ApplicationStateModel } from "../../../state/models/application-state.model";
import { NameTableSectionOptions } from "./name-table/nametable-section.component";
import { NameTableComponent } from "./name-table/nametable.component";
import { WorkerInfo } from "../../../hooks/use-worker-info";
import { SummaryTableComponent, SummaryTableOptions } from "./summary-table/summarytable.component";
import { ScheduleMode } from "../schedule-state.model";
import {
  ShiftsSectionComponent,
  ShiftsSectionOptions,
} from "./shifts-section/shifts-section.component";
import { shiftSectionDataCy } from "./worker-info-section.models";

type SubcomponentsOptions = Omit<NameTableSectionOptions, "isWorker" | "uuid" | "updateData"> &
  ShiftsSectionOptions &
  SummaryTableOptions;

export interface WorkerInfoSectionOptions
  extends Omit<SubcomponentsOptions, "data" | "workerGroup" | "sectionKey"> {
  sectionName: string;
  data: WorkerInfo[];
  sectionIndex: number;
}

export function WorkerInfoSection({
  data,
  sectionIndex,
  ...options
}: WorkerInfoSectionOptions): JSX.Element {
  const { mode } = useSelector((state: ApplicationStateModel) => state.actualState);

  const dataRows = data.map(
    (workerInfo) =>
      new DataRow(workerInfo.workerName, workerInfo.workerShifts, mode === ScheduleMode.Edit)
  );
  return (
    <div className="sectionContainer">
      <div className="sectionContainer borderContainer">
        <div>
          <NameTableComponent data={dataRows} isWorker={true} {...options} />
        </div>
        <div className="table leftContainerBorder" data-cy={shiftSectionDataCy(sectionIndex)}>
          <ShiftsSectionComponent sectionKey={options.sectionName} data={dataRows} {...options} />
        </div>
      </div>
      <div className="summaryContainer">
        <SummaryTableComponent data={dataRows} {...options} sectionIndex={sectionIndex} />
      </div>
    </div>
  );
}
