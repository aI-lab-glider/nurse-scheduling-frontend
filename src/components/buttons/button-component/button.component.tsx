/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ButtonProps } from "@material-ui/core";
import React, { Ref } from "react";
import styled from "styled-components";
import { fontFamilyPrimary, colors } from "../../../assets/colors";

export type MarginString =
  | `${number}px`
  | `${number}px ${number}px`
  | `${number}px ${number}px ${number}px ${number}px`;

export interface ButtonBaseProps extends Omit<ButtonProps, "variant"> {
  marginString?: MarginString;
}

export type ButtonVariant = "primary" | "secondary" | "circle";
export type ButtonOptions = ButtonBaseProps & {
  variant?: ButtonVariant;
};

export const Button = React.forwardRef(
  (
    { variant = "primary", disabled = false, ...rest }: ButtonOptions,
    ref?: Ref<HTMLButtonElement>
  ) => {
    let Component: typeof ButtonBase;
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

const ButtonBase = styled.button<ButtonBaseProps>`
  background: none;
  border: none;
  padding: 6px 20px 6px 20px;
  margin: ${(props) => props.marginString ?? "5px 10px 5px 10px"};
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
`;

const ButtonPrimary = styled(ButtonBase)`
  background-color: ${colors.primary};
  color: ${colors.white};

  &:disabled {
    color: ${colors.white};
    opacity: 0.65;

    &:hover {
      cursor: default;
      box-shadow: none;
      font-weight: 400;
    }
  }
`;

const ButtonSecondary = styled(ButtonBase)`
  border: 1px solid ${colors.primary};
  background-color: ${colors.white};
  color: ${colors.primary};

  &:disabled {
    border: 1px solid ${colors.secondaryButtonDisabledColor};
    color: ${colors.secondaryButtonDisabledColor};

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
    background-color: ${colors.circleButtonHoverColor};
  }

  &:disabled {
    color: ${colors.circleButtonDisabledColor};
    opacity: 0.65;

    &:hover {
      cursor: default;
      box-shadow: none;
      background: none;
    }
  }
`;
