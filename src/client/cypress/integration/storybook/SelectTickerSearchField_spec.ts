import { findSearchSection } from '../../util/euclid';
import {
  getReactSelectOption,
  getReactSelectOptionWithIndex,
} from '../../util/react-select';
import { visitComponentStoryIFrame } from '../../util/storybook';

const storybookUrl = 'localhost:6006';

describe('SelectTickerSearchField tests', () => {
  specify('successfully loads', () => {
    visitComponentStoryIFrame(storybookUrl, 'SelectTickerSearchField');
  });

  specify('the topic selector works', () => {
    cy.reload();
    findSearchSection()
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
    findSearchSection()
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
    getReactSelectOptionWithIndex(findSearchSection, 'Search', 1);
  });

  specify('the search selector works for AAPL', () => {
    cy.reload();
    findSearchSection()
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

export {};
