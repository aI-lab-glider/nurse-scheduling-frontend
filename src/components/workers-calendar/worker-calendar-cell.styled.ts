/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import styled from "styled-components";
import { colors } from "../../assets/css-consts";

export const ShiftCell = styled.div`
  padding: 5px;
  background-color: white;
  &.notCurrentMonthtrue {
    background-color: #f0f0f0;
  }
`;

export const ShiftTop = styled.div`
  letter-spacing: 0.75px;
  font-weight: bold;
  font-size: 12px;
  display: flex;
  margin-bottom: 5px;
  flex-direction: row;
  justify-content: flex-end;

  &.notCurrentMonthtrue {
    color: ${colors.gray500};
  }
`;

export const ShiftBottom = styled.div`
  height: 18px;
  size: 4px;
  letter-spacing: 0.25px;
  font-weight: 800;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  border-radius: 2px;
`;

export const ShiftSymbol = styled.p`
  font-size: 12px;
  margin: auto;
`;
