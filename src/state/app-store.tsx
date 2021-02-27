/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { createStore, applyMiddleware, compose } from "redux";
import { appReducer } from "./app.reducer";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: "https://ca7cbc8f34f344ed89f37811a3d9d974@o467102.ingest.sentry.io/5492940",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
  normalizeDepth: 10,
});

export const sentryReduxEnhancer = Sentry.createReduxEnhancer({});

const composedEnhancer = compose(
  composeWithDevTools(applyMiddleware(thunkMiddleware), sentryReduxEnhancer)
);
export const appStore = createStore(appReducer, composedEnhancer);
