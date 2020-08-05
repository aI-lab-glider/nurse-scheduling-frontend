import React from 'react';
import ImportButtonsComponent from './import-buttons';
import ProblemMetadataComponent from './problem-metadata';

function ToolbarComponent () {
    return (
        <React.Fragment>
            <ImportButtonsComponent />
            <ProblemMetadataComponent />
        </React.Fragment>
    )
}

export default ToolbarComponent;