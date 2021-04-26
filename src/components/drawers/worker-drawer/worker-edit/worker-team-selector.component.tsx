/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Grid, Typography } from "@material-ui/core";
import * as _ from "lodash";
import React from "react";
import { Team } from "../../../../state/schedule-data/worker-info/worker-info.model";
import { TEAM_PREFIX } from "../../../../logic/schedule-parser/workers-info.parser";
import {
  ButtonData,
  DropdownButtons,
} from "../../../buttons/dropdown-buttons/dropdown-buttons.component";
import { FormFieldOptions, useFormFieldStyles } from "./worker-edit.models";
import { t } from "../../../../helpers/translations.helper";
interface TeamSelectorOptions extends FormFieldOptions {
  setTeam: (team: Team) => void;
  team: Team;
}

export function TeamSelector({ setTeam, team }: TeamSelectorOptions): JSX.Element {
  const classes = useFormFieldStyles();

  function handleTeamUpdate(newTeam: Team): void {
    setTeam(newTeam);
  }

  const defaultTeams = _.range(1, 6).map((i) => `${TEAM_PREFIX} ${i}` as Team);

  const teamsOptions: ButtonData[] = defaultTeams.map((team) => ({
    label: team,
    action: (): void => handleTeamUpdate(team),
    dataCy: team.toLowerCase(),
  }));

  return (
    <Grid item xs={6}>
      <Typography className={classes.label}>{t("workerTeam")}</Typography>
      <DropdownButtons
        dataCy="team-dropdown"
        buttons={teamsOptions}
        mainLabel={team}
        buttonVariant="secondary"
        variant="contract-time-dropdown"
      />
    </Grid>
  );
}
