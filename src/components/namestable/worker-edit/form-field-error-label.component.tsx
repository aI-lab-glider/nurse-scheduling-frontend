/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Grid, Typography } from "@material-ui/core";
import React, { useMemo } from "react";
import { useFormFieldStyles } from "./worker-edit.models";

export interface FormFieldErrorLabelOptions {
  shouldBeVisible: boolean;
  message: string;
}

export function FormFieldErrorLabel({
  shouldBeVisible: condition,
  message,
}: FormFieldErrorLabelOptions): JSX.Element {
  const classes = useFormFieldStyles();

  return (
    <>
      <Grid item xs={12}>
        <Typography className={classes.errorLabel}>{condition && message}</Typography>
      </Grid>
    </>
  );
}

interface FormFieldErrorLabelStackOptions {
  errorLabels: FormFieldErrorLabelOptions[];
}

export function FormFieldErrorLabelStack({
  errorLabels,
}: FormFieldErrorLabelStackOptions): JSX.Element {
  const emptyErrorField = useMemo(
    () => <FormFieldErrorLabel shouldBeVisible={false} message="" />,
    []
  );
  return (
    <>
      {!errorLabels.some((e) => e.shouldBeVisible)
        ? emptyErrorField
        : errorLabels
            .filter((e) => e.shouldBeVisible)
            .map((e, index) => <FormFieldErrorLabel key={`${e.message}_${index}`} {...e} />)}
    </>
  );
}
