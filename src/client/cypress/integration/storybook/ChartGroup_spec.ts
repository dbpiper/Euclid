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
          .find('#done-animating-checker')
          .should('exist')
          .should('have.class', 'done-animating')
          .then(() => {
            cy.matchImageSnapshot();
          });
      });
    });
  });
});

export {};
