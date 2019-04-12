import { findChartSurface, visualTestChart } from '../../util/euclid';
import {
  getStorybookUrl,
  visitComponentStoryIFrame,
} from '../../util/storybook';

describe('SelectedTickerChart tests', () => {
  specify('successfully loads', () => {
    visitComponentStoryIFrame(getStorybookUrl(), 'SelectedTickerChart');
  });

  specify('the chart works', () => {
    visualTestChart();
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
