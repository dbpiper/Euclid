const getReactSelectOption = () =>
  cy
    .get('div#root')
    .find('div')
    .filter((_index, element) => {
      const filteredElement = element.id.match(
        'react-select-[0-9]*-option-[0-9]*',
      );
      if (!filteredElement) {
        return false;
      }
      return true;
    });

const getReactSelectOptionWithIndex = (
  componentFunc: () => Cypress.Chainable<JQuery<HTMLElement>>,
  placeholder: string,
  index: number,
) =>
  componentFunc()
    .contains(placeholder)
    .click()
    .parent()
    .parent()
    .parent()
    .find('div')
    .filter((_index, element) => {
      const filteredElement = element.id.match(
        `react-select-[0-9]*-option-${index}`,
      );
      if (!filteredElement) {
        return false;
      }
      return true;
    });

export { getReactSelectOption, getReactSelectOptionWithIndex };
