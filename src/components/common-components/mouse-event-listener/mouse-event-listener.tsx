/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import styled from "styled-components";

interface MouseEventListenerOptions {
  onClick: (e: React.MouseEvent<unknown>) => void;
  onWheel: (e: React.WheelEvent<unknown>) => void;
}

export function MouseEventListener({ onClick, onWheel }: MouseEventListenerOptions) {
  return <FullscreenDiv onClick={onClick} onWheel={onWheel} />;
}

const FullscreenDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
`;
