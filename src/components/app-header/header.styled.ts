/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import styled from "styled-components";
import {Button as MaterialButton, Tab as MaterialTab} from "@material-ui/core";
import { TabList as MaterialTabList } from "@material-ui/lab";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import SettingsIcon from "@material-ui/icons/Settings";
import { colors } from "../../assets/css-consts";
import { Button } from "../buttons/button-component/button.component";

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 42px;
  background-color: #fff;
  align-items: center;
  justify-content: space-around;
  position: fixed;
  top: 0;
  z-index: 2;
`;

export const TabList = styled(MaterialTabList)`
  & span[class*="indicator"] {
    background-color: ${({ theme }) => theme.primary};
    height: 3px;
    bottom: 7px;
    outline: none;
  }
`;

export const Tab = styled(MaterialTab)`
  && {
    text-transform: none;
    color: ${({ disabled, theme }) => (disabled ? colors.gray100 : theme.primaryText)};
    outline: none;
    font-weight: ${({ theme }) => theme.FontStyles.roboto.Regular16px.fontWeight};
    font-size: ${({ theme }) => theme.FontStyles.roboto.Regular16px.fontSize};
    min-width: 0;
    opacity: 1;
    margin: 0 20px 0 0;
    padding: 0;
  }
  &:hover {
    color: ${({ disabled, theme }) => (disabled ? colors.gray100 : theme.primaryText)};
    cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
    opacity: 1;
    outline: none;
  }
  &[class*="selected"] {
    outline: none;
    font-weight: ${({ theme }) => theme.FontStyles.roboto.Black16px.fontWeight};
  }
`;

export const ReturnToNowBtn = styled(Button)``;

export const Settings = styled(SettingsIcon)`
  color: ${colors.white};
`;

export const Help = styled(HelpOutlineIcon)`
  margin: auto 5px;
  cursor: pointer;
  color: ${colors.white};
`;

export const Logo = styled(AssignmentIndIcon)`
  color: ${colors.white};
`;

export const Filler = styled.div`
  flex-grow: 1;
`;

export const UtilityButton = styled(MaterialButton)`
  padding: 5px;
  display: block;
  && {
    color: ${colors.white};
    padding-right: 5px;
    letter-spacing: 0.75px;
    outline: none;
    text-transform: none;
    &:hover {
      text-decoration: underline;
      transform: none;
    }
  }
`;

export const Row = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-content: center;
  justify-items: center;
  justify-content: center;
  align-items: center;

  p {
    white-space: nowrap;
  }
`;
