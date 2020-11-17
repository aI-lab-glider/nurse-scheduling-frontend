import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, StoreEnhancer } from "redux";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import App from "./app";
import "./assets/styles/styles-all.scss";
import * as serviceWorker from "./serviceWorker";
import { appReducer } from "./state/app.reducer";

type WindowWithDevTools = Window & {
  __REDUX_DEVTOOLS_EXTENSION__: () => StoreEnhancer<unknown, {}>;
};

const isReduxDevtoolsExtAvailable = (
  arg: Window | WindowWithDevTools
): arg is WindowWithDevTools => {
  return "__REDUX_DEVTOOLS_EXTENSION__" in arg;
};

const appStore = createStore(
  appReducer,
  isReduxDevtoolsExtAvailable(window) ? window.__REDUX_DEVTOOLS_EXTENSION__() : undefined
);

Sentry.init({
  dsn: "https://ca7cbc8f34f344ed89f37811a3d9d974@o467102.ingest.sentry.io/5492940",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={appStore}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
