/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { createStore, applyMiddleware, compose } from "redux";
import { appReducer } from "./app.reducer";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { sentryReduxEnhancer } from "../index";

const composedEnhancer = compose(
  composeWithDevTools(applyMiddleware(thunkMiddleware)),
  sentryReduxEnhancer
);
export const appStore = createStore(appReducer, composedEnhancer);
