import React from "react";
import { Button } from "../common-components/button-component/button.component";

export function NewMonthPlanComponent(): JSX.Element {
  return (
    <>
      <div className={"newMonthComponents"}>
        <img
          src="https://filestore.community.support.microsoft.com/api/images/72e3f188-79a1-465f-90ca-27262d769841"
          alt="image"
        />
        <p>Nie masz planu na ten miesiąc</p>
        <div className={"newPageButtonsPane"}>
          <Button size="small" className="submit-button" variant="outlined">
            Kopiuj plan z $miesiąc
          </Button>
          <Button size="small" className="submit-button" variant="primary">
            Wgraj plan z pliku
          </Button>
        </div>
      </div>
    </>
  );
}
