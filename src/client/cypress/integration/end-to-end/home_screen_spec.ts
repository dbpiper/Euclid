import { findSearchArea } from '../../util/euclid';
import {
  getReactSelectOption,
  getReactSelectOptionWithIndex,
} from '../../util/react-select';

const euclidUrl = 'http://localhost:5000';

describe('Home screen', () => {
  specify('successfully loads', () => {
    cy.visit(euclidUrl);
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
        cy.reload(true);
        findSearchArea()
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
        cy.reload(true);
        findSearchArea()
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
        cy.reload(true);
        getReactSelectOptionWithIndex(findSearchArea, 'Search', 1);
      });
    });

    specify('the search selector works for AAPL', () => {
      cy.reload(true);
      findSearchArea()
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
