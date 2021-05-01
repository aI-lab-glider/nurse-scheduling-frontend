/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { ReactNode, useState } from "react";
import styled from "styled-components";
import { colors, fontSizeBase } from "../../../assets/colors";

interface FoldingSectionOptions {
  name: string;
  children: ReactNode;
}
/**
 * @description Function component which provides collapsing functionaliny for underlying children elements
 * @param name - section name
 * @param children - children elements
 * @returns JSX.Element
 */
export function FoldingSection({ name, children }: FoldingSectionOptions): JSX.Element {
  const [opened, setOpened] = useState(false);
  return (
    <Wrapper data-cy="folding-section">
      <SeparatorWrapper>
        <LabelWrapper
          onClick={(): void => setOpened((prev) => !prev)}
          data-cy="open-folding-section"
        >
          <span>{opened ? <ExpandMoreIcon /> : <ChevronRightIcon />}</span>
          <span>{name}</span>
        </LabelWrapper>
        <Separator />
      </SeparatorWrapper>
      <div style={{ display: opened ? "initial" : "none" }}>{children}</div>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  min-height: 50px;
  height: auto;
  overflow: hidden;
  padding-top: 20px;
`;
const SeparatorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 20px;
`;

const Separator = styled.hr`
  width: 100%;
  border: 0;
  border-top: 2px solid ${colors.tableBorderGrey};
  z-index: 1;
`;
const LabelWrapper = styled.div`
  cursor: pointer;
  white-space: nowrap;
  align-items: center;
  display: flex;
  font-style: normal;
  font-size: ${fontSizeBase};
  line-height: 20px;
  letter-spacing: 0.75px;
  color: ${colors.primaryTextColor};
  padding-right: 10px;
  z-index: 100;
  background-color: white;
`;
