/// <reference types="cypress" />

context("Load Exported Schedule", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("baseUrl"));
    cy.contains("Plik").click();
    cy.get('[data-cy="file-input"]').attachFile("example.xlsx");
  });

  it("Should be able to save file and load the exported file", () => {
    cy.contains("Zapisz jako...").click();

    cy.get("a[download]")
      .then(
        (anchor) =>
          new Cypress.Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", anchor.prop("href"), true);
            xhr.responseType = "blob";
            xhr.onload = () => {
              if (xhr.status === 200) {
                const blob = xhr.response;
                const reader = new FileReader();
                reader.onload = () => {
                  resolve(reader.result);
                };
                reader.readAsBinaryString(blob);
              }
            };
            xhr.send();
          })
      )
      .then((file) => {
        cy.writeFile("cypress/fixtures/grafik.xlsx", file, "binary");
        cy.get('[data-cy="file-input"]').attachFile("grafik.xlsx");
      });
  });
});
