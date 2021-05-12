/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { ReactNode, useState } from "react";
import * as S from "./styled";
import { colors, fontSizeBase } from "../../assets/colors";

interface ScheduleFoldingSectionOptions {
  name: string;
  children: ReactNode;
}
/**
 * Used only in schedule. For other use cases, use @see FoldingSection from  @module common-components
 */
export function ScheduleFoldingSection({
  name,
  children,
}: ScheduleFoldingSectionOptions): JSX.Element {
  const [opened, setOpened] = useState(true);
  return (
    <>
      <SeparatorWrapper>
        <LabelWrapper onClick={(): void => setOpened((prev) => !prev)}>
          <span>{opened ? <ExpandMoreIcon /> : <ChevronRightIcon />}</span>
          <span>{name}</span>
        </LabelWrapper>
        <Separator />
      </SeparatorWrapper>
      <div style={{ display: opened ? "initial" : "none" }}>{children}</div>
    </>
  );
}

const SeparatorWrapper = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
`;

const Separator = styled.hr`
  width: 102%;
  border: 0;
  border-top: 2px solid ${colors.tableBorderGrey};
`;
const LabelWrapper = styled.div`
  width: 126px;
  cursor: pointer;
  align-items: center;
  display: flex;
  font-style: normal;
  font-weight: bold;
  font-size: ${fontSizeBase};
  line-height: 20px;
  letter-spacing: 0.75px;
  color: ${colors.primary};
  padding-right: 10px;
`;
