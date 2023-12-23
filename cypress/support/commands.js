Cypress.Commands.add('setCookies', (cookies) => {
  cookies.reverse().forEach((cookie) => {
    cy.setCookie(cookie.name, cookie.value);
  });
});

Cypress.Commands.add('goToSection', (section) => {
  cy.visit('/');
  cy.title().should('contain', 'React App');
  cy.contains(section).click();
});

Cypress.Commands.add('getButton', (buttonName) => {
  cy.get('button').contains(buttonName);
});

Cypress.Commands.add('clickButton', (buttonName) => {
  cy.get('button').contains(buttonName).click();
});

Cypress.Commands.add('addAttachment', (number, name, link) => {
  cy.clickButton('Add attachment');
  if (number != 1) cy.get('p').contains(name.toLowerCase()).click();
  cy.get('[type="text"]')
    .eq(0)
    .type(name + ' attachment');
  cy.get('[type="text"]').eq(1).type(`https://www.${link}`);
  cy.clickButton('Submit').then(() => {
    cy.get('a.MuiBox-root')
      .eq(number - 1)
      .should('have.attr', 'href', `https://www.${link}`)
      .and('have.attr', 'aria-label', name + ' attachment');
  });
});
