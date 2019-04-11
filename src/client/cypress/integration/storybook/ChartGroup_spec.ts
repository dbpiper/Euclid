import { findChartSurface, visualTestChart } from '../../util/euclid';
import {
  getStorybookUrl,
  visitComponentStoryIFrame,
} from '../../util/storybook';

describe('ChartGroup tests', () => {
  specify('successfully loads', () => {
    visitComponentStoryIFrame(getStorybookUrl(), 'ChartGroup');
  });

  describe('the chart works', () => {
    specify('the default view works', () => {
      visualTestChart();
    });

    specify('YTD works', () => {
      cy.contains('YTD')
        .click()
        .then(() => {
          visualTestChart();
        });
    });

    specify('6 Months works', () => {
      cy.contains('6 Months')
        .click()
        .then(() => {
          visualTestChart();
        });
    });

    specify('1 Year works', () => {
      cy.contains('1 Year')
        .click()
        .then(() => {
          visualTestChart();
        });
    });

    specify('3 Years works', () => {
      cy.contains('3 Years')
        .click()
        .then(() => {
          visualTestChart();
        });
    });

    specify('5 Years works', () => {
      cy.contains('5 Years')
        .click()
        .then(() => {
          visualTestChart();
        });
    });

    specify('All Time works', () => {
      cy.contains('All Time')
        .click()
        .then(() => {
          visualTestChart();
        });
    });
  });

  specify('tooltip works', () => {
    findChartSurface()
      .should('be.visible')
      .trigger('mouseover')
      .then(() => {
        cy.get('.recharts-tooltip-wrapper')
          .should('be.visible')
          .then(() => {
            cy.matchImageSnapshot();
          });
      });
  });
});

export {};
