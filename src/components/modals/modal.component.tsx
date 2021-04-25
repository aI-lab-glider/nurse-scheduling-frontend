/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Box, Divider, IconButton, Paper } from "@material-ui/core";
import { MdClose } from "react-icons/md";
import styled from "styled-components";
import { colors, fontSizeBase, fontSizeLg } from "../../assets/colors";

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
      <ModalWrapper
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
        <FadeWrapper in={open}>
          <ContentWrapper>
            <HeaderWrapper className={classNames?.titleMargin}>
              <Title>{title}</Title>
              <ExitButton className={classNames?.exitButton} onClick={handleClose}>
                <MdClose />
              </ExitButton>
            </HeaderWrapper>
            <Divider />
            <BodyWrapper className={classNames?.modalBody}>{body}</BodyWrapper>
            <FooterWrapper className={classNames?.footer}>{footer}</FooterWrapper>
          </ContentWrapper>
        </FadeWrapper>
      </ModalWrapper>
    </div>
  );
}

const ModalWrapper = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;
const ContentWrapper = styled(Paper)`
  background-color: ${colors.white};
  box-shadow: -3px 4px 20px 4px rgba(0, 0, 0, 0.15);
  max-height: 40%;
  max-width: 35%;
  min-width: 350px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: ${colors.primary};
  font-size: ${fontSizeLg};
  margin-bottom: 0;
`;

const ExitButton = styled(IconButton)`
  color: ${colors.primary};
  align-items: center;
  padding-right: 0;
`;

const BodyWrapper = styled(Box)`
  position: relative;
  overflow: auto;
  overflow-x: hidden;
  color: ${colors.primary};
  font-family: ${colors.primaryTextColor};
  font-size: ${fontSizeBase};
  margin: 10px 0;
`;

const FooterWrapper = styled(Box)`
  margin-left: -10px; // TODO: Button has 10px margin, change to 0 after update
  margin-top: -5px;
`;

const FadeWrapper = styled(Fade)`
  padding: 10px 20px;
`;
