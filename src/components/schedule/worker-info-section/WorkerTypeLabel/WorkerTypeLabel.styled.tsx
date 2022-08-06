import styled from "styled-components";
import { colors } from "../../../../assets/css-consts";

export const WorkerTypeLabelContainer = styled.span`
  height: 22px;
  line-height: 14px;
  width: 110px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  padding: 4px 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${colors.white};
  text-transform: uppercase;

  & svg {
    margin-right: 5px;
    margin-left: 1px;
    fill: ${colors.white};
  }
  & svg path {
    fill: ${colors.white};
  }

  &.nurse-label {
    background-color: ${colors.nurseColor};
  }
  &.other-label {
    background-color: ${colors.babysitterLabelBackground};
  }
`;
