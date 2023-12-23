/// <reference types='cypress' />

export const typeDateTime = (type, date, time, ampm) => {
  const newDate = date.split('.').join('');
  const finalDate =
    newDate.slice(2, 4) + newDate.slice(0, 2) + newDate.slice(4);

  if (type == 'start') {
    cy.get('[type="tel"]')
      .eq(0)
      .click()
      .clear()
      .type(`${finalDate}${time.split(':').join('')}${ampm}`);
  } else {
    cy.get('[type="tel"]')
      .eq(1)
      .click()
      .clear()
      .type(`${finalDate}${time.split(':').join('')}${ampm}`);
  }
}

export const assertStartDate = () => {
  if (form.startAmpm == 'am' && form.startHour != '12') {
    cy.get('p')
      .eq(1)
      .should(
        'contain',
        `${form.day}.${form.monthNo}.${form.year}, ${form.startHour}:${form.startMinute}`
      );
  } else if (form.startAmpm == 'pm' && form.startHour != '12') {
    form.startHour = (parseInt(form.startHour, 10) + 12)
      .toString()
      .padStart(2, '0');
    cy.get('p')
      .eq(1)
      .should(
        'contain',
        `${form.day}.${form.monthNo}.${form.year}, ${form.startHour}:${form.startMinute}`
      );
  } else if (form.startAmpm == 'am' && form.startHour == '12') {
    form.startHour = '00';
    cy.get('p')
      .eq(1)
      .should(
        'contain',
        `${form.day}.${form.monthNo}.${form.year}, ${form.startHour}:${form.startMinute}`
      );
  } else {
    cy.get('p')
      .eq(1)
      .should(
        'contain',
        `${form.day}.${form.monthNo}.${form.year}, ${form.startHour}:${form.startMinute}`
      );
  }
}

export const selectMonth = (month) => {
  cy.get('[id*="grid-label"]').then((currentMonth) => {
    let currentMonthNumber =
      new Date(currentMonth.text().split(' ')).getMonth() + 1;
    let selectMonthNumber = new Date(`${month} 2000`.split(' ')).getMonth() + 1;

    if (
      currentMonthNumber < selectMonthNumber &&
      !currentMonth.text().includes(month)
    ) {
      cy.get('[title="Next month"]').click();
      selectMonth(month);
    } else if (
      currentMonthNumber > selectMonthNumber &&
      !currentMonth.text().includes(month)
    ) {
      cy.get('[title="Previous month"]').click();
      selectMonth(month);
    } else {
    }
  });
}

export const setDateTime = (type, day, month, year, ampm) => {
  if (type == 'start') {
    cy.get('[aria-label*="Choose date"]').eq(0).click();
  } else {
    cy.get('[aria-label*="Choose date"]').eq(1).click();
  }

  cy.get('[aria-label*="year view"]').click();
  cy.get('[class*="PrivatePickersYear"]').contains(year).click();

  selectMonth(month);

  if (day.charAt(0) === '0') {
    day = day.slice(1);
    cy.get('[role="gridcell"]').contains(day).click();
  } else {
    cy.get('[role="gridcell"]').contains(day).click();
  }

  cy.contains(ampm).click();

  if (type == 'start') {
    // 12:30
    cy.get('.MuiClock-squareMask').click(110, 20, { force: true });
    cy.get('.MuiClock-squareMask').click(110, 200, { force: true });
  } else {
    // 14:00
    cy.get('.MuiClock-squareMask').click(185, 65, { force: true });
    cy.get('.MuiClock-squareMask').click(110, 20, { force: true });
  }
}

export const assertDateTime = (type) => {
  if (type == 'start') {
    if (
      `${new Date(`${form.monthText} 2000`.split(' ')).getMonth() + 1}` < 10
    ) {
      cy.get('[type="tel"]')
        .eq(0)
        .should(
          'have.attr',
          'value',
          `0${new Date(`${form.monthText} 2000`.split(' ')).getMonth() + 1}/${form.day}/${form.year} 12:30 ${form.startAmpm}`
        );
    } else {
      cy.get('[type="tel"]')
        .eq(0)
        .should(
          'have.attr',
          'value',
          `${new Date(`${form.monthText} 2000`.split(' ')).getMonth() + 1}/${form.day}/${form.year} 12:30 ${form.startAmpm}`
        );
    }
  } else {
    if (
      `${new Date(`${form.monthText} 2000`.split(' ')).getMonth() + 1}` < 10
    ) {
      cy.get('[type="tel"]')
        .eq(1)
        .should(
          'have.attr',
          'value',
          `0${new Date(`${form.monthText} 2000`.split(' ')).getMonth() + 1}/${form.day}/${form.year} 02:00 ${form.startAmpm}`
        );
    } else {
      cy.get('[type="tel"]')
        .eq(1)
        .should(
          'have.attr',
          'value',
          `${new Date(`${form.monthText} 2000`.split(' ')).getMonth() + 1}/${form.day}/${form.year} 02:00 ${form.startAmpm}`
        );
    }
  }
}

export const currentDateTime = () => {
  let currentDate = new Date();
  let day = currentDate.getDate();
  let month = currentDate.getMonth() + 1;
  let year = currentDate.getFullYear().toString().slice(-2);
  let hour = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();

  if (day < 10) day = `0${day}`;
  if (month < 10) month = `0${month}`;
  if (hour < 10) hour = `0${hour}`;
  if (minutes < 10) minutes = `0${minutes}`;
  if (seconds < 10) seconds = `0${seconds}`;

  let dateTime = `${day}.${month} - ${hour}:${minutes}`;
  return dateTime;
}
