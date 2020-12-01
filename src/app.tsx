import React from "react";
import { CustomGlobalHotKeys, HeaderComponent } from "./components/common-components";
import { ToolbarComponent } from "./components/schedule-page/toolbar/toolbar.component";

function App(): JSX.Element {
  return (
    <React.Fragment>
      <div>
        <CustomGlobalHotKeys />
        <HeaderComponent />
        <ToolbarComponent />
      </div>
    </React.Fragment>
  );
}

export default App;
