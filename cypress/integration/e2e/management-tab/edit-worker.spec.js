/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/// <reference types="cypress" />

context("Tab 'zarządzanie'", () => {
  beforeEach(() => {
    cy.loadScheduleToMonth();
    cy.contains("Zarządzanie").click();
    cy.contains("Opiekunka 1").parent().contains("Edytuj").click();
  });

  describe("Edit worker", () => {
    it("Should be able to close edit drawer", () => {
      cy.contains("Edycja pracownika").should("be.visible");
      cy.get('[data-cy="exit-drawer"]').click();
      cy.contains("Edycja pracownika").should("not.exist");
    });

    it("Should be able to edit the name", () => {
      cy.contains("Opiekunka 1").get("input").clear().type("Ala Makota");
      cy.get('[value="Ala Makota"]').should("be.visible");
    });

    it("Should be able to edit the position", () => {
      cy.get('[data-cy="position"]').contains("Opiekunka").click();
      cy.get('[data-cy="worker-button"]').contains("Pielęgniarka").click();
      cy.get('[data-cy="position"]').contains("Pielęgniarka");
    });

    context("Editing the time", () => {
      beforeEach(() => {
        cy.get('[data-cy="contract"]').contains("Typ umowy").click();
      });

      it("Should properly render conditional sections", () => {
        cy.get('[data-cy="contract-button"]').contains("Umowa o pracę").click();
        cy.get('[data-cy="contract"]').contains("Umowa o pracę");
        cy.get('[data-cy="contract-time-dropdown"]').contains("1/1").click();
        cy.get('[data-cy="time-contract-button"]').contains("inne").click();
        cy.contains("Wpisz wymiar etatu");
        cy.get('[data-cy="contract"]').contains("Umowa o pracę").click();
        cy.get('[data-cy="contract-button"]').contains("Umowa zlecenie").click();
        cy.get('[data-cy="contract"]').contains("Umowa zlecenie");
        cy.contains("Ilość godzin");
      });

      it("Should properly handle number of hours when employment contract", () => {
        cy.get('[data-cy="contract-button"]').contains("Umowa zlecenie").click();
        cy.get('[data-cy="civilTime"] input').clear({ force: true }).type("123");
        cy.get('[data-cy="position"]').contains("Opiekunka").click(); // unclick
        cy.get('[value="123"]').should("be.visible");
      });

      it("Should properly translate hours to fractions and fractions to hours", () => {
        cy.get('[data-cy="contract-button"]').contains("Umowa o pracę").click();
        cy.get('[data-cy="contract-time-dropdown"]').contains("1/1").click();
        cy.get('[data-cy="time-contract-button"]').contains("inne").click();
        cy.get('[data-cy="employmentTimeOther"] input').clear({ force: true }).type("34");
        cy.get('[data-cy="contract"]').contains("Umowa o pracę").click();
        cy.get('[data-cy="contract-button"]').contains("Umowa zlecenie").click();
        cy.get('[data-cy="civilTime"] input').should("have.value", "126");
        cy.get('[data-cy="civilTime"] input').clear({ force: true }).type("88");
        cy.get('[data-cy="contract"]').contains("Umowa zlecenie").click();
        cy.get('[data-cy="contract-button"]').contains("Umowa o pracę").click();
        cy.get('[data-cy="employmentTimeOther"] input').should("have.value", "1/2");
      });
    });
  });
});
