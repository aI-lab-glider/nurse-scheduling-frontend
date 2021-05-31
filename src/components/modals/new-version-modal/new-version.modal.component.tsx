/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { t } from "../../../helpers/translations.helper";
import { Button } from "../../buttons/button-component/button.component";
import DefaultModal, { modalFooterButtonMarginString } from "../modal.component";
import { CookiesProvider } from "../../../logic/data-access/cookies-provider";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";

const useStyles = makeStyles({
  bodyText: {
    color: ScssVars.secondary,
    fontSize: 16,
    paddingRight: 40,
  },
});

interface NewVersionModalOptions {
  setOpen: (open: boolean) => void;
  open: boolean;
}

export default function NewVersionModal(options: NewVersionModalOptions): JSX.Element {
  const classes = useStyles();
  const { setOpen, open } = options;
  const handleClose = (): void => {
    setOpen(false);
  };

  const title = t("update");

  const version = CookiesProvider.getCookie("appversion");
  const body = (
    <div>
      <p className={classes.bodyText}>{t("updateMessage", { version })}</p>
    </div>
  );

  const footer = (
    <div>
      <Button
        onClick={handleClose}
        size="small"
        className="submit-button"
        variant="primary"
        marginString={modalFooterButtonMarginString}
      >
        OK
      </Button>
    </div>
  );

  return <DefaultModal open={open} setOpen={setOpen} title={title} body={body} footer={footer} />;
}
