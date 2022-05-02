/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  Grid,
  Typography,
  TextField as MaterialTextField,
  Input as MaterialInput,
} from "@material-ui/core";
import styled from "styled-components";
import {
  fontSizeBase,
  fontSizeXs,
  fontWeightMedium,
  lineHeightXl,
} from "../../../../assets/css-consts";
import { Button } from "../../../common-components";

export const OptionsContainer = styled(Grid)`
  min-height: 80%;
  background-color: #fff;
  padding: 15px;
  border-radius: 5px;
`;

export const SubmitButton = styled(Button)`
  float: right;
  &:nth-of-type(2n) {
    margin-left: 8px;
  }
`;

export const Label = styled(Typography)`
  font-size: 14px !important;
  font-weight: ${fontWeightMedium} !important;
  margin-left: 4%;
`;

export const ErrorLabel = styled(Typography)`
  font-size: ${fontSizeXs};
  font-weight: 100;
  line-height: ${lineHeightXl};
  margin-left: 4%;
  color: red;
  height: 20px;
`;

export const TextField = styled(MaterialTextField)`
  width: 240px;
  height: 32px;
  margin-left: 4%;
  margin-bottom: 5px;
  & input {
    padding-bottom: 8px;
    padding-top: 8px;
    padding-left: 6px;
    padding-right: 6px;
    font-size: 14px;
    color: ${({ theme }) => theme.primaryText};
  }
  & .MuiOutlinedInput-root {
    color: ${({ theme }) => theme.primaryText};
    &.Mui-focused fieldset {
      border-color: ${({ theme }) => theme.gray};
    }
  }
`;

export const Input = styled(MaterialInput)`
  margin-left: 4%;
`;
