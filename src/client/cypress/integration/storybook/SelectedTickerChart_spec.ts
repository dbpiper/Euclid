import { visualTestChart } from '../../util/euclid';
import {
  getStorybookUrl,
  visitComponentStoryIFrame,
} from '../../util/storybook';

describe('SelectedTickerChart tests', () => {
  specify('successfully loads', () => {
    visitComponentStoryIFrame(getStorybookUrl(), 'SelectedTickerChart');
  });

  describe('header tests', () => {
    describe('the chart works', () => {
      specify('the default view works', () => {
        visualTestChart();
      });
    });
  });
});

export {};
