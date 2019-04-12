/**
 * Finds the first matching Cypress wrapped element
 *
 * @param {string} elementSelector The jquery-style selector to use to find the
 * element
 * @param {string} classRegex The regular expression to use to filter matching
 * elements from the selected elements -- Essentially provides the ability
 * to extend the CSS selector to have the power of Regex.
 */
const findElementRegex = (elementSelector: string, classRegex: string) =>
  cy
    .get('div#root')
    .find(elementSelector)
    .filter((_index, element) => {
      const filteredElement = element.className.match(classRegex);
      if (!filteredElement) {
        return false;
      }
      return true;
    })
    .first();

/**
 * Finds the Cypress wrapped element of the Euclid Header's
 * SearchArea. This can then be used to perform tests on the Header.
 */
const findSearchArea = () => findElementRegex('div', 'Header.{2}SearchArea.*');

/**
 * Finds the Cypress wrapped element of the Euclid SearchField's
 * SearchSection. This can then be used to perform tests on the SearchSection.
 */
const findSearchSection = () =>
  findElementRegex('section', 'SearchField.{2}SearchSection.*');

/**
 * Finds the Cypress wrapped element of the Euclid ChartGroup's
 * ChartBody. This can then be used to perform tests on the ChartBody.
 */
const findChartBody = () =>
  findElementRegex('div', 'ChartGroup.{2}ChartBody.*');

/**
 * Finds the svg path which represents the curve of the chart, aka.
 * the graph.
 */
const findChartCurve = () => cy.get('.recharts-curve.recharts-line-curve');

const findChartGrid = () => cy.get('.recharts-cartesian-grid');

/**
 * Gets the surface of the chart, which is the actual svg element
 * on which the chart is drawn on.
 */
const findChartSurface = () => cy.get('svg.recharts-surface').first();

const visualTestChart = () =>
  cy
    .get('#done-animating-checker')
    .should('exist')
    .should('have.class', 'done-animating')
    .then(() => {
      cy.matchImageSnapshot();
    });

export {
  findChartSurface,
  findChartGrid,
  findChartCurve,
  visualTestChart,
  findChartBody,
  findSearchArea,
  findElementRegex,
  findSearchSection,
};
