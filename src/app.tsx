import React from "react";
import { CustomGlobalHotKeys, HeaderComponent } from "./components/common-components";
import ViewOnlyComponent from "./components/schedule-page/view-only.component";

function App(): JSX.Element {
  return (
    <React.Fragment>
      <div>
        <CustomGlobalHotKeys />
        <HeaderComponent />
        <ViewOnlyComponent />
      </div>
    </React.Fragment>
  );
}

export default App;
