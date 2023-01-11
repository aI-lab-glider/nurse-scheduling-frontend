import React, { useState } from "react";
import DefaultModal from "../modal.component";
import { Button } from "../../buttons/button-component/button.component";
import { t } from "../../../helpers/translations.helper";
import { TextField } from "@material-ui/core";
import { useFirebase } from "react-redux-firebase";
import { Formik, Form, Field, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';

interface RegistrationModalOptions {
    setOpen: (open: boolean) => void;
    onClick: () => void;
    open: boolean;
}



const Input = ({ label, ...props }: { label: string, name: string, type?: string }) => {
    const [field, meta] = useField(props);
    return (
        <>
            <TextField
                {...field}
                {...props}
                label={label}
                variant="outlined"
            />
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}

        </>

    );

};


export function RegistrationModal(options: RegistrationModalOptions): JSX.Element {
    const { setOpen, open, onClick } = options;

    const title = t("register");
    const firebase = useFirebase();


    const body = (
        <Formik
            initialValues={{ email: '', password: '', repeatPassword: '' }}
            validationSchema={
                Yup.object({
                    email: Yup.string()
                        .email('Invalid email address')
                        .required('Email is required'),
                    password: Yup.string().required('Password is required'),
                    repeatPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
                })
            }
            onSubmit={({ email, password }, { setSubmitting }) => {
                setSubmitting(true);
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        console.log('Cool');
                        setSubmitting(false)
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.error(errorCode, errorMessage);
                        setSubmitting(false)
                    });
            }}
        >
            {({ isSubmitting, submitForm }) => <Form>
                <div style={{ flexDirection: "column", display: "flex", padding: 25 }}>

                    <Input name="email" label="Email" />
                    <Input type="password" name="password" label="Password" />
                    <Input type="password" name="repeatPassword" label="Password confirmation" />
                    <Button
                        disabled={isSubmitting}
                        onClick={submitForm}
                        type="submit"
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
                        {t("register")}
                    </Button>
                </div>
            </Form>
            }
        </Formik>
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
