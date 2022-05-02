/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import styled from "styled-components";

export const Wrapper = styled.div`
  margin-top: 20px;
  width: 100%;
`;

export const CalendarWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;
export const CalendarRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 4px;
  width: 100%;
`;
export const DayName = styled.div`
  letter-spacing: 0.75px;
  text-align: center;
  font-weight: bold;
  font-size: 12px;
  height: 22px;
  padding: 4px;
  background-color: #fff;
`;
