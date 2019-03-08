/**
 * Gets the Cypress wrapped element of the Euclid Header's
 * SearchArea. This can then be used to perform tests on the Header.
 */
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

export { getSearchArea };
