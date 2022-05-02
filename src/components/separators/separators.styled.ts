import styled from "styled-components";

export const Line = styled.div`
  background-color: ${({ theme }) => theme.primaryText};
  height: 2px;
  min-width: 16px;
`;

export const ContainingRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

export const Maxline = styled(Line)`
  display: flex;
  flex: 1;
`;

export const SeparatorText = styled.p`
  font-weight: bold;
  font-size: 14px;
  margin-left: 8px;
  margin-right: 8px;
`;
