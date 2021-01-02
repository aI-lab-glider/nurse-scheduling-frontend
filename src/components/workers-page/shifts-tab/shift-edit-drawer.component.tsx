import React from "react";

export default function ShiftEditDrower(): JSX.Element {
  return (
    <>
      <div className={"edit-field"}>
        <h4>Nazwa zmiany</h4>
        <input type="text" placeholder="Nazwa zmiany" id="shift-name" name="shift-name" />
        <br />

        <h4>Typ zmiany</h4>
        <input type="radio" id="works" name="status" value="works" checked />
        <label htmlFor="works">Pracująca</label>
        <input type="radio" id="not-works" name="status" value="not-works" />
        <label htmlFor="not-works">Nie pracująca</label>

        <h4>Godziny zmiany</h4>
        <input type="time" id="appt" name="appt" min="00:00" max="23:59" required />
      </div>
    </>
  );
}
