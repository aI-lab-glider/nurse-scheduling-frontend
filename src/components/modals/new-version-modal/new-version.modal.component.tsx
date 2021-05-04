/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import { t } from "../../../helpers/translations.helper";
import { Button } from "../../buttons/button-component/button.component";
import DefaultModal from "../modal.component";
import { CookiesProvider } from "../../../logic/data-access/cookies-provider";
import { makeStyles } from "@material-ui/core/styles";
import ScssVars from "../../../assets/styles/styles/custom/_variables.module.scss";

const useStyles = makeStyles({
  bodyText: {
    color: ScssVars.secondary,
    fontSize: 16,
    paddingLeft: 25,
    paddingRight: 65,
  },
  footer: {
    paddingLeft: 14,
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
    <div className={classes.footer}>
      <Button onClick={handleClose} size="small" className="submit-button" variant="primary">
        OK
      </Button>
    </div>
  );

  return <DefaultModal open={open} setOpen={setOpen} title={title} body={body} footer={footer} />;
}