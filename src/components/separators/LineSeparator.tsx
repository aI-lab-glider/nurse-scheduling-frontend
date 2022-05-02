import React from "react";
import { ContainingRow, Line, Maxline, SeparatorText } from "./separators.styled";

interface LineSeparatorInterface {
  text: string;
}

export const LineSeparator = ({ text }: LineSeparatorInterface) => (
  <ContainingRow>
    <Line />
    <SeparatorText>{text}</SeparatorText>
    <Maxline />
  </ContainingRow>
);
