/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { createStore, applyMiddleware, compose } from "redux";
import { appReducer } from "./app.reducer";
import thunkMiddleware from "redux-thunk";
import * as Sentry from "@sentry/react";

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  // Optionally pass options listed below
});

const composedEnhancer = compose(applyMiddleware(thunkMiddleware), sentryReduxEnhancer);
export const appStore = createStore(appReducer, composedEnhancer);
