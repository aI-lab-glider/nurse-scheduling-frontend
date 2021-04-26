/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ButtonProps } from "@material-ui/core";
import React, { Ref } from "react";
import styled from "styled-components";
import { fontFamilyPrimary, colors } from "../../../assets/colors";

export type ButtonVariant = "primary" | "secondary" | "circle";
export type ButtonOptions = Omit<ButtonProps, "variant"> & {
  variant?: ButtonVariant;
};

export const Button = React.forwardRef(
  (
    { variant = "primary", disabled = false, ...rest }: ButtonOptions,
    ref?: Ref<HTMLButtonElement>
  ) => {
    let Component;
    if (variant === "primary") {
      Component = ButtonPrimary;
    } else if (variant === "secondary") {
      Component = ButtonSecondary;
    } else if (variant === "circle") {
      Component = ButtonCircle;
    } else {
      throw new Error(`Unrecognized Button variant: ${variant}`);
    }

    return <Component {...rest} ref={ref} disabled={disabled} />;
  }
);

const ButtonBase = styled.button`
  background: none;
  border: none;
  padding: 6px 20px 6px 20px;
  margin: 5px 10px 5px 10px;
  white-space: nowrap;
  border-radius: 40px;
  font-family: ${fontFamilyPrimary};
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: 0.025em;
  text-align: center;

  &:hover {
    cursor: pointer;
    font-weight: 500;
    box-shadow: 0 10px 20px -10px ${colors.gray500};
  }

  &:focus {
    outline: none;
  }
}
`;

const ButtonPrimary = styled(ButtonBase)`
  background-color: ${colors.primary};
  color: ${colors.white};

  &:disabled {
    background-color: rgba(141, 153, 170, 255);
    color: ${colors.white};

    &:hover {
      cursor: default;
      box-shadow: none;
      font-weight: 400;
    }
  }
`;

const ButtonSecondary = styled(ButtonBase)`
  border: 1px solid rgba(29, 53, 87, 1);
  background-color: rgba(255, 255, 255, 1);
  color: rgba(29, 53, 87, 1);

  &:disabled {
    border: 1px solid rgba(141, 153, 170, 255);
    color: rgba(141, 153, 170, 255);

    &:hover {
      cursor: default;
      box-shadow: none;
      font-weight: 400;
    }
  }
`;

const ButtonCircle = styled(ButtonBase)`
  padding: 0;
  height: 24px;
  width: 24px;
  margin: 15px 10px 15px 10px;
  display: flex;
  justify-content: center;

  &:hover {
    cursor: pointer;
    box-shadow: none;
    background-color: rgba(233, 235, 239, 255);
  }

  &:disabled {
    color: rgba(141, 153, 170, 255);

    &:hover {
      cursor: default;
      box-shadow: none;
      background: none;
    }
`;
