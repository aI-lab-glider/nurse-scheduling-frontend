import { ButtonProps } from "@material-ui/core";
import React, { Ref } from "react";

export type ButtonVariant = "primary" | "secondary" | "outlined" | "circle-outlined";
export type ButtonOptions = Omit<ButtonProps, "variant"> & {
  variant?: ButtonVariant;
};

export const Button = React.forwardRef(
  ({ variant = "primary", className, ...rest }: ButtonOptions, ref?: Ref<HTMLButtonElement>) => {
    return <button {...rest} ref={ref} className={`btn btn-${variant} ${className}`} />;
  }
);
