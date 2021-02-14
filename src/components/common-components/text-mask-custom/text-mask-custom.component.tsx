/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import MaskedInput from "react-text-mask";

export interface TextMaskCustomProps {
  inputRef: (ref: HTMLInputElement | null) => void;
}

export function TextMaskCustom(props: TextMaskCustomProps): JSX.Element {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref: { inputElement: HTMLInputElement }): void => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/[1-9]/, "/", /[1-9]/]}
      showMask
    />
  );
}
