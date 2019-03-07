// tslint:disable: no-magic-numbers

const url = 'http://localhost:5000';

const getSearchArea = () =>
  cy
    .get('div#root')
    .find('div')
    .filter((_index, element) => {
      const filteredElement = element.className.match('Header.{2}SearchArea.*');
      if (!filteredElement) {
        return false;
      }
      return true;
    });

const getReactSelectOption = () =>
  cy
    .get('div#root')
    .find('div')
    .filter((_index, element) => {
      const filteredElement = element.id.match(
        'react-select-[0-9]*-option-[0-9]*',
      );
      if (!filteredElement) {
        return false;
      }
      return true;
    });

const getReactSelectOptionWithIndex = (placeholder: string, index: number) =>
  getSearchArea()
    .contains(placeholder)
    .click()
    .parent()
    .parent()
    .parent()
    .find('div')
    .filter((_index, element) => {
      const filteredElement = element.id.match(
        `react-select-[0-9]*-option-${index}`,
      );
      if (!filteredElement) {
        return false;
      }
      return true;
    });

describe('Home screen', () => {
  specify('successfully loads', () => {
    cy.visit(url);
  });

  describe('header tests', () => {
    specify('the title is correct', () => {
      cy.get('span')
        .filter((_index, element) => {
          const filteredElement = element.className.match('Header.{2}Title.*');
          if (!filteredElement) {
            return false;
          }
          return true;
        })
        .contains('Euclid');
    });

    describe('the dropdown works', () => {
      specify('the topic selector works', () => {
        cy.reload();
        getSearchArea()
          .contains('All')
          .parent()
          .trigger('mouseover')
          .click()
          .then(() => {
            getReactSelectOption()
              .contains('Stocks')
              .should('be.visible')
              .trigger('mouseover')
              .click();
          });
      });

      specify('the search selector works for SPY', () => {
        cy.reload();
        getSearchArea()
          .contains('Search')
          .parent()
          .trigger('mouseover')
          .click()
          .then(() => {
            getReactSelectOption()
              .contains('SPY')
              .should('be.visible')
              .trigger('mouseover')
              .click();
          });
      });

      specify('the search selector works for MSFT', () => {
        cy.reload();
        getReactSelectOptionWithIndex('Search', 1);
      });
    });

    specify('the search selector works for AAPL', () => {
      cy.reload();
      getSearchArea()
        .contains('Search')
        .parent()
        .trigger('mouseover')
        .click()
        .then(() => {
          getReactSelectOption()
            .contains('AAPL')
            .should('be.visible')
            .trigger('mouseover')
            .click();
        });
    });
  });
});
export {};
