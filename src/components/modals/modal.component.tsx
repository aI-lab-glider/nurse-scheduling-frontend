/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Divider } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import React from "react";
import { MdClose } from "react-icons/md";
import * as S from "./modal.styled";

export interface ModalOptions {
  setOpen: (open: boolean) => void;
  open: boolean;
  title: string;
  body: JSX.Element;
  footer: JSX.Element;
  closeOptions?: () => void;
  classNames?: Record<
    "modal" | "paper" | "titleMargin" | "modalBody" | "footer" | "exitButton" | "title",
    string
  >;
}

export default function DefaultModal(options: ModalOptions): JSX.Element {
  const { setOpen, open, title, body, footer, closeOptions, classNames } = options;

  const handleClose = (): void => {
    closeOptions ? closeOptions() : setOpen(false);
    setOpen(false);
  };

  return (
    <div>
      <S.ModalWrapper
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classNames?.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <S.FadeWrapper in={open}>
          <S.ContentWrapper>
            <S.HeaderWrapper className={classNames?.titleMargin}>
              <S.Title>{title}</S.Title>
              <S.ExitButton className={classNames?.exitButton} onClick={handleClose}>
                <MdClose />
              </S.ExitButton>
            </S.HeaderWrapper>
            <Divider />
            <S.BodyWrapper className={classNames?.modalBody}>{body}</S.BodyWrapper>
            <S.FooterWrapper className={classNames?.footer}>{footer}</S.FooterWrapper>
          </S.ContentWrapper>
        </S.FadeWrapper>
      </S.ModalWrapper>
    </div>
  );
}
