import { compose, applyMiddleware, createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { appReducer } from "./app.reducer";
import * as Sentry from "@sentry/react";
import { ReportingObserver } from "@sentry/integrations";
import { Integrations } from "@sentry/tracing";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import storage from "redux-persist/lib/storage";

import { createBrowserHistory } from "history";
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["modal"],
};

const history = createBrowserHistory();

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  normalizeDepth: 10,
  integrations: [
    new ReportingObserver(),
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
    }),
  ],
  tracesSampleRate: 1.0,
});
const sentryReduxEnhancer = Sentry.createReduxEnhancer();

const composedEnhancer = composeWithDevTools(
  compose(applyMiddleware(thunkMiddleware), sentryReduxEnhancer)
);

const createAppStore = () => {
  const persistedReducer = persistReducer(persistConfig, appReducer);

  const store = createStore(persistedReducer, composedEnhancer);

  const persistor = persistStore(store);

  return { store, persistor };
};
export default createAppStore;
