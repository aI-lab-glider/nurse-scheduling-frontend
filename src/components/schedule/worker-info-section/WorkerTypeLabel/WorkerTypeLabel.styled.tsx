import styled from "styled-components";
import { colors } from "../../../../assets/css-consts";

export const WorkerTypeLabelContainer = styled.span`
  height: 30px;
  line-height: 30px;
  max-width: 130px;
  font-size: 14px;
  border-radius: 5px;
  background-color: ${colors.nurseColor};
  padding: 4px 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${colors.white};
  text-transform: uppercase;

  & svg {
    margin-right: 5px;
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
