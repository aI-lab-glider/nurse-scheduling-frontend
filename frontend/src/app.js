import React from 'react';
import './app.css';
import {
  ToolbarComponent, TableComponent, ValidationWindowComponent
} from './components';

function App() {
  return (
    <React.Fragment>
          <div className="header">
          <ToolbarComponent />
          </div>
          <div className="cols-3-to-1">
            <TableComponent/>
            <ValidationWindowComponent/>
          </div>
    </React.Fragment>
  );
}

export default App;
