import React, { useEffect, useState } from "react";
import DefaultModal from "../modal.component";
import { Button } from "../../buttons/button-component/button.component";
import { t } from "../../../helpers/translations.helper";
import { TextField } from "@material-ui/core";
import { useFirebase } from "react-redux-firebase";

interface LoginModalOptions {
  setOpen: (open: boolean) => void;
  onClick: () => void;
  open: boolean;
}

export default function LoginModal(options: LoginModalOptions): JSX.Element {
  const { setOpen, open, onClick } = options;

  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");

  const handleClose = (): void => {
    onClick();
    setOpen(false);
  };

  const title = t("login");
  const firebase = useFirebase();
  const handleLogin = (): void => {
    firebase.login({ email: Username, password: Password }).then(
      () => {
        handleClose();
      },
      (error) => {
        console.log(error);
      }
    );
  };
  const body = (
    <>
      <div style={{ flexDirection: "column", display: "flex", padding: 20 }}>
        <TextField
          value={Username}
          onChange={(e) => setUsername(e.target.value)}
          label={t("email")}
          autoComplete="email"
          variant="outlined"
        />
        <TextField
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
          label={t("password")}
          variant="outlined"
          autoComplete="password"
          type="password"
          style={{ marginTop: 20 }}
        />
        <Button
          onClick={handleLogin}
          size="medium"
          className="submit-button"
          variant="primary"
          data-cy="btn-reload-app-error"
          marginString="5px 10px 5px 0px"
          style={{
            marginTop: 40,
            alignSelf: "center",
            width: "70%",
          }}
        >
          {t("login")}
        </Button>
      </div>
    </>
  );

  return (
    <DefaultModal
      closeOptions={onClick}
      open={open}
      setOpen={setOpen}
      title={title}
      body={body}
      footer={null}
    />
  );
}
