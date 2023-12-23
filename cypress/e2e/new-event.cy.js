import {
  typeDateTime,
  assertStartDate,
  setDateTime,
  assertDateTime,
  currentDateTime,
} from '../../cypress/page-object/date-time.js';
/// <reference types='cypress' />
let env = `[${Cypress.env('cookies').toUpperCase()}] `;

describe(env + 'New event', () => {
  let env = `[${Cypress.env('cookies').toUpperCase()}] `;
  let eventUrl, eventName;

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

  it('Should create new event', () => {
    cy.goToSection('Add new Knowledge meeting');
    cy.get('h1')
      .should('be.visible')
      .and('contain', 'Tell us more about your idea');

    eventName = form.title + currentDateTime();
    cy.get('[type="text"]').type(eventName);

    cy.get('[class*="multiline"]').type(form.shortDescription);
    typeDateTime(
      'start',
      `${form.day}.${form.monthNo}.${form.year}`,
      `${form.startHour}:${form.startMinute}`,
      `${form.startAmpm}`
    );

    typeDateTime(
      'end',
      `${form.day}.${form.monthNo}.${form.year}`,
      `${form.endHour}:${form.endMinute}`,
      `${form.startAmpm}`
    );

    cy.get('#mui-rte-editor').prev('div').type(form.longDescription);
    cy.get('[type="file"]').selectFile('cypress/fixtures/cover.jpg');

    cy.clickButton('Submit').then(() => {
      cy.get('h3').contains('Participants:').should('be.visible');
      cy.get('h3').contains(eventName);
      cy.get('.public-DraftStyleDefault-block').should(
        'contain',
        form.longDescription
      );
      assertStartDate();
    });

    cy.url().then(($url) => {
      eventUrl = $url;
    });
  });

  it('Should participate in the event', () => {
    cy.visit(eventUrl);
    cy.get('h3').contains('Participants:').should('be.visible');

    cy.clickButton('Sign Up');
    cy.clickButton('Office').then(() => {
      cy.get('h3')
        .siblings('div')
        .find('p')
        .contains('office')
        .should('be.visible');

      cy.getButton('Change location').should('be.visible');
      cy.getButton('Sign Out').should('be.visible');
    });

    cy.clickButton('Change location').then(() => {
      cy.clickButton('Remote');
      cy.get('h3')
        .siblings('div')
        .find('p')
        .contains('remote')
        .should('be.visible');

      cy.getButton('Change location').should('be.visible');
      cy.getButton('Sign Out').should('be.visible').click();
      cy.getButton('Sign Up').should('be.visible');
    });
  });

  it('Should add attachments', () => {
    cy.visit(eventUrl);
    cy.get('h3').contains('Participants:').should('be.visible');

    cy.addAttachment(1, 'Recording', 'youtube.com');
    cy.addAttachment(2, 'Presentation', 'canva.com');
    cy.addAttachment(3, 'Repository', 'github.com');
    cy.addAttachment(4, 'Other', 'google.com');
  });

  it('Should set date and time using calendar component', () => {
    cy.goToSection('Make Your DevTalk');
    cy.get('h1')
      .should('be.visible')
      .and('contain', 'Tell us more about your idea');

    setDateTime(
      'start',
      form.day,
      form.monthText,
      form.year,
      form.startAmpm.toUpperCase()
    );
    assertDateTime('start');

    setDateTime(
      'end',
      form.day,
      form.monthText,
      form.year,
      form.endAmPm.toUpperCase()
    );
    assertDateTime('end');
  });

  it('Should be visible on the list with correct data', () => {
    cy.visit('/');
    cy.get('h6')
      .contains(eventName)
      .siblings('p')
      .should('contain', form.shortDescription);

    cy.get('h6')
      .contains(eventName)
      .should('be.visible')
      .click()
      .then(() => {
        cy.get('h3').contains(eventName).should('be.visible');

        cy.get('.css-2imjyh').should(($el) => {
          expect($el.children().length).to.equal(4);
        });

        cy.get('#mui-rte-editor').find('span').contains(form.longDescription);
        cy.get('p')
          .eq(1)
          .should(
            'contain',
            `${form.day}.${form.monthNo}.${form.year}, ${form.startHour}:${form.startMinute}`
          );
      });
  });
});
