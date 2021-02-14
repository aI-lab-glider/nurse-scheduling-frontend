/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { NameTableSection } from "./nametable-section.component";
import { BaseSectionOptions } from "../schedule-page/table/schedule/sections/base-section/base-section.component";
import { WorkerType } from "../../common-models/worker-info.model";

interface NameSectionOptions extends Partial<BaseSectionOptions> {
  workerType?: WorkerType;
  clickable: boolean;
}

export function NameTableComponent(options: NameSectionOptions): JSX.Element {
  const { data = [], workerType, clickable } = options;

  return (
    <div>
      <NameTableSection dataRow={data} workerType={workerType} clickable={clickable} />
    </div>
  );
}
