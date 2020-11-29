import { ButtonProps } from "@material-ui/core";
import React, { Ref } from "react";

export type ButtonOptions = Omit<ButtonProps, "variant"> & {
  variant?: "primary" | "secondary" | "outlined";
};

export const Button = React.forwardRef(
  ({ variant = "primary", ...rest }: ButtonOptions, ref?: Ref<HTMLButtonElement>) => {
    return <button {...rest} ref={ref} className={`btn btn-${variant}`} />;
  }
);
