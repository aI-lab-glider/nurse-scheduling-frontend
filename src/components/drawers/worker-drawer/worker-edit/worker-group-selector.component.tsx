/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Grid, Typography } from "@material-ui/core";
import * as _ from "lodash";
import React from "react";
import { WorkerGroup } from "../../../../state/models/common-models/worker-info.model";
import { WORKER_GROUP_PREFIX } from "../../../../logic/schedule-parser/workers-info.parser";
import {
  ButtonData,
  DropdownButtons,
} from "../../../buttons/dropdown-buttons/dropdown-buttons.component";
import { FormFieldOptions, useFormFieldStyles } from "./worker-edit.models";
interface WorkerGroupSelectorOptions extends FormFieldOptions {
  setWorkerGroup: (workerGroup: WorkerGroup) => void;
  workerGroup: WorkerGroup;
}

export function WorkerGroupSelector({
  setWorkerGroup,
  workerGroup,
}: WorkerGroupSelectorOptions): JSX.Element {
  const classes = useFormFieldStyles();

  function handleWorkerGroupUpdate(newGroup: WorkerGroup): void {
    setWorkerGroup(newGroup);
  }

  const defaultGroups = _.range(1, 6).map((i) => `${WORKER_GROUP_PREFIX} ${i}` as WorkerGroup);

  const workerGroupsOptions: ButtonData[] = defaultGroups.map((groupName) => ({
    label: groupName,
    action: (): void => handleWorkerGroupUpdate(groupName),
    dataCy: groupName.toLowerCase(),
  }));

  return (
    <Grid item xs={6}>
      <Typography className={classes.label}>Zespół pracownika</Typography>
      <DropdownButtons
        dataCy="workergroup-dropdown"
        buttons={workerGroupsOptions}
        mainLabel={workerGroup}
        buttonVariant="secondary"
        variant="contract-time-dropdown"
      />
    </Grid>
  );
}
