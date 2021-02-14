/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ButtonProps } from "@material-ui/core";
import React, { Ref } from "react";
import classNames from "classnames/bind";

export type ButtonVariant = "primary" | "secondary" | "circle";
export type ButtonOptions = Omit<ButtonProps, "variant"> & {
  variant?: ButtonVariant;
};

export const Button = React.forwardRef(
  (
    { variant = "primary", className, disabled = false, ...rest }: ButtonOptions,
    ref?: Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        {...rest}
        ref={ref}
        className={classNames(
          "btn",
          `btn-${variant}`,
          disabled ? `btn-${variant}-disabled` : "",
          className
        )}
        disabled={disabled}
      />
    );
  }
);
