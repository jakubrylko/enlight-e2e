import { currentDateTime } from '../../cypress/page-object/date-time.js';
/// <reference types='cypress' />
let env = `[${Cypress.env('cookies').toUpperCase()}] `;

describe(env + 'Ideas', () => {
  let ideaUrl, ideaName;

  before('Load form data', () => {
    cy.fixture('form-data.json').then((form) => {
      globalThis.form = form;
    });
  });

  beforeEach('Set cookies', () => {
    cy.fixture(`${Cypress.env('cookies')}-cookies.json`).then((cookies) => {
      cy.setCookies(cookies);
    });
  });

  after('Write cookies', () => {
    cy.getCookies().then((cookies) => {
      const newCookies = JSON.stringify(cookies, null, 2);
      cy.writeFile(
        `cypress/fixtures/${Cypress.env('cookies')}-cookies.json`,
        newCookies
      );
    });
  });

  it('Should create new idea', () => {
    cy.goToSection('Ideas');
    cy.get('h2').should('be.visible').and('contain', 'Ideas');

    cy.contains('Add new idea').click();
    cy.get('h1')
      .should('be.visible')
      .and('contain', 'Tell us more about your idea');

    ideaName = form.title + currentDateTime();
    cy.get('[type="text"]').type(ideaName);
    cy.get('[class*="multiline"]').type(form.shortDescription);

    cy.clickButton('Submit').then(() => {
      cy.get('h3').contains('Voters:').should('be.visible');
      cy.get('h6').should('contain', ideaName);
      cy.get('h6').siblings('p').should('contain', form.shortDescription);
    });

    cy.url().then(($url) => {
      ideaUrl = $url;
    });
  });

  it('Should vote on idea', () => {
    cy.visit(ideaUrl);
    cy.get('[type="button"]')
      .eq(1)
      .click()
      .then(() => {
        cy.get('[type="button"]')
          .eq(1)
          .should('have.text', '1')
          .and('have.css', 'background-color', 'rgb(25, 118, 210)');
        cy.get('h3').siblings('div').find('p').should('be.visible');
      });

    cy.get('[type="button"]')
      .eq(1)
      .click()
      .then(() => {
        cy.get('[type="button"]')
          .eq(1)
          .should('have.text', '0')
          .and('have.css', 'background-color', 'rgba(0, 0, 0, 0)');
      });
  });

  it('Should be visible on the list with correct data', () => {
    cy.goToSection('Ideas');
    cy.get('h2').should('be.visible').and('contain', 'Ideas');

    cy.get('h6').contains(ideaName).should('be.visible');
    cy.get('h6').siblings('p').should('contain', form.shortDescription);
  });

  it('Should vote on idea from the list', () => {
    cy.goToSection('Ideas');
    cy.get('h2').should('be.visible').and('contain', 'Ideas');

    cy.get('h6').contains(ideaName).should('be.visible');
    cy.get('h6')
      .contains(ideaName)
      .parent('div')
      .siblings('div')
      .as('buttonDiv');
    cy.get('@buttonDiv')
      .find('button')
      .click()
      .then(() => {
        cy.get('@buttonDiv')
          .find('button')
          .should('have.text', '1')
          .and('have.css', 'background-color', 'rgb(25, 118, 210)');
      });

    cy.get('@buttonDiv')
      .find('button')
      .click()
      .then(() => {
        cy.get('@buttonDiv')
          .find('button')
          .should('have.text', '0')
          .and('have.css', 'background-color', 'rgba(0, 0, 0, 0)');
      });
  });
});
