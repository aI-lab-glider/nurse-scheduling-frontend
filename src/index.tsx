/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AppConfigProvider } from "./state/app-config-context";
import * as serviceWorker from "./serviceWorker";
import App from "./app";
import { AppErrorBoundary } from "./components/app-error-boundary/app-error-boundary.component";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { createFirestoreInstance } from "redux-firestore";
import { PersistGate } from "redux-persist/integration/react";
import createAppStore from "./state/createStore";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();
const firebaseConfig = {
  apiKey: "AIzaSyDinMicURwTDj0vWiIFV_u5E3DzG92_nyg",
  authDomain: "nurse-scheduling-fe30c.firebaseapp.com",
  projectId: "nurse-scheduling-fe30c",
  storageBucket: "nurse-scheduling-fe30c.appspot.com",
  messagingSenderId: "594399357491",
  appId: "1:594399357491:web:b92ec38ed45c8210bbd146",
  measurementId: "G-EVVMHE09RF",
};

const { store, persistor } = createAppStore();

firebase.initializeApp(firebaseConfig);
firebase.firestore();
firebase.auth();
firebase.analytics();

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,
};

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};
ReactDOM.render(
  <AppErrorBoundary>
    <DndProvider backend={HTML5Backend}>
      <Router history={history}>
        <React.StrictMode>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <AppConfigProvider>
                <ReactReduxFirebaseProvider {...rrfProps}>
                  <App />
                </ReactReduxFirebaseProvider>
              </AppConfigProvider>
            </PersistGate>
          </Provider>
        </React.StrictMode>
      </Router>
    </DndProvider>
  </AppErrorBoundary>,
  document.getElementById("root")
);
/* eslint-disable @typescript-eslint/no-explicit-any */
if ((window as any).Cypress) {
  (window as any).store = store;
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
