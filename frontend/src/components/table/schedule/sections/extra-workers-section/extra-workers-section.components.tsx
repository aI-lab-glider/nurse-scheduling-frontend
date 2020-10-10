import React from "react";
import { DataRowHelper } from "../../../../../helpers/row.helper";
import { BaseSectionComponent } from "../base-section/base-section.component";
import { ExtraWorkersSectionOptions } from "./extra-workers-section.options";
import {ExtraWorkersLogic} from "../../../../../logic/real-schedule-logic/extra-workers.logic";

export function ExtraWorkersSection(options: ExtraWorkersSectionOptions) {
  const { data =[], metaDataLogic, onSectionUpdated } = options;
  const logic = new ExtraWorkersLogic(DataRowHelper.dataRowsAsValueDict<number>(data, true));

  return (
    (
    <BaseSectionComponent
          {...options}
          data={data}
          metaDataLogic={metaDataLogic}
          onSectionUpdated={onSectionUpdated}
          logic={logic}
      />
  )
  );
}
