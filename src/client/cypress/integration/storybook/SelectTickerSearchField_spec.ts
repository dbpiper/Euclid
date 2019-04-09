import { findSearchSection } from '../../util/euclid';
import {
  getReactSelectOption,
  getReactSelectOptionWithIndex,
} from '../../util/react-select';
import {
  getStorybookUrl,
  visitComponentStoryIFrame,
} from '../../util/storybook';

describe('SelectTickerSearchField tests', () => {
  specify('successfully loads', () => {
    visitComponentStoryIFrame(getStorybookUrl(), 'SelectTickerSearchField');
  });

  specify('the topic selector works', () => {
    cy.reload(true);
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
    cy.reload(true);
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
    cy.reload(true);
    getReactSelectOptionWithIndex(findSearchSection, 'Search', 1);
  });

  specify('the search selector works for AAPL', () => {
    cy.reload(true);
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
