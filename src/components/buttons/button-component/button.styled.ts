/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import styled from "styled-components";
import { fontFamilyPrimary, colors } from "../../../assets/colors";

// TODO: Get rid of padding, margin, border radius
export const ButtonBase = styled.button`
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

export const ButtonPrimary = styled(ButtonBase)`
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

export const ButtonSecondary = styled(ButtonBase)`
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

export const ButtonCircle = styled(ButtonBase)`
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
    opacity: 0.65;

    &:hover {
      cursor: default;
      box-shadow: none;
      background: none;
    }
`;
