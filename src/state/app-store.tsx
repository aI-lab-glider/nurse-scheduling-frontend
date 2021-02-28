/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { createStore, applyMiddleware, compose } from "redux";
import { appReducer } from "./app.reducer";
import thunkMiddleware from "redux-thunk";
import * as Sentry from "@sentry/react";
import { ReportingObserver as ReportingObserverIntegration } from "@sentry/integrations";
import { Integrations } from "@sentry/tracing";
import { createBrowserHistory } from "history";

// const history = createBrowserHistory();
//
// Sentry.init({
//   dsn: process.env.REACT_APP_SENTRY_DSN,
//   debug: true,
//   normalizeDepth: 10,
//   integrations: [new ReportingObserverIntegration(),
//     new Integrations.BrowserTracing({
//       // Can also use reactRouterV4Instrumentation
//       routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
//     })
//   ],
//
// });
//
// const sentryReduxEnhancer = Sentry.createReduxEnhancer({
//   // Optionally pass options listed below
// });
//
// const composedEnhancer = compose(applyMiddleware(thunkMiddleware), sentryReduxEnhancer);
// export const appStore = createStore(appReducer, composedEnhancer);
