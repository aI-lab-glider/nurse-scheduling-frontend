/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React, { ReactElement, ReactChild, ReactChildren } from "react";
import { ThemeProvider } from "styled-components";
import { connect } from "react-redux";

import { ApplicationStateModel } from "../../state/application-state.model";
import { ThemeKey, themes } from ".";

interface TPR {
  themeKey: ThemeKey;
  children: ReactChild | ReactChildren | ReactElement;
}

const TProvider: React.FC<TPR> = ({ themeKey, children }: TPR) => (
  <ThemeProvider theme={themes[themeKey]}>{children}</ThemeProvider>
);

const mapSTP = (store: ApplicationStateModel) => ({
  themeKey: store.theme.key,
});

export default connect(mapSTP)(TProvider);
