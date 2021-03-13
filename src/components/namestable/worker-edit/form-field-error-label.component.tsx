/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Grid, Typography } from "@material-ui/core";
import React, { useMemo } from "react";
import { useFormFieldStyles } from "./worker-edit.models";

interface FormFieldErrorLabelOptions {
  condition: boolean;
  message: string;
}

export function FormFieldErrorLabel({
  condition,
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
  const emptyErrorField = useMemo(() => <FormFieldErrorLabel condition={false} message="" />, []);
  return (
    <>
      {!errorLabels.some((e) => e.condition)
        ? emptyErrorField
        : errorLabels
            .filter((e) => e.condition)
            .map((e, index) => <FormFieldErrorLabel key={`${e.message}_${index}`} {...e} />)}
    </>
  );
}
