import { findChartBody } from '../../util/euclid';
import {
  getStorybookUrl,
  visitComponentStoryIFrame,
} from '../../util/storybook';

describe('ChartGroup', () => {
  specify('successfully loads', () => {
    visitComponentStoryIFrame(getStorybookUrl(), 'ChartGroup');
  });

  describe('header tests', () => {
    describe('the chart works', () => {
      specify('the default view is the same', () => {
        cy.reload(true);
        findChartBody()
          .contains('Feb')
          .then(() => {
            cy.compareSnapshot('ChartGroup');
          });

        // findSearchArea()
        //   .contains('All')
        //   .parent()
        //   .trigger('mouseover')
        //   .click()
        //   .then(() => {
        //     getReactSelectOption()
        //       .contains('Stocks')
        //       .should('be.visible')
        //       .trigger('mouseover')
        //       .click();
        //   });
      });
    });
  });
});

export {};
