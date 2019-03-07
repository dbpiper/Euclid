// tslint:disable: no-magic-numbers

const url = 'localhost:6006';

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

const getReactSelectOptionWithIndex = (placeholder: string, index: number) =>
  getSearchArea()
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

const goToComponent = (name: string) => {
  const lowerCaseName: string = name.toLowerCase();
  const typedName = cy
    .get('input')
    .should('have.attr', 'placeholder', 'Press "/" to search...')
    .type(name);
  typedName.then(() => {
    const getComponentDiv = () =>
      cy.get('div').filter((_index, element) => {
        const filteredElement = element.id.match(
          `.*${lowerCaseName}--${lowerCaseName}`,
        );
        if (!filteredElement) {
          return false;
        }
        return true;
      });
    getComponentDiv()
      .invoke('attr', 'id')
      .as('ComponentId');
    getComponentDiv().click();
  });
};

const navigateToStorybookIFrame = () => {
  cy.get('@ComponentId').then(componentId => {
    const iframeUrl = `iframe.html?id=${componentId}`;
    cy.visit(`${url}/${iframeUrl}`, {
      timeout: Cypress.config('pageLoadTimeout'),
    });
  });
};

const visitComponent = (name: string) => {
  cy.visit(url);
  goToComponent(name);
  navigateToStorybookIFrame();
};

const reloadPage = () => {
  cy.reload();
};

describe('Home screen', () => {
  specify('successfully loads', () => {
    visitComponent('Header');
  });

  describe('header tests', () => {
    specify('the title is correct', () => {
      reloadPage();
      cy.get('span')
        .filter((_index, element) => {
          const filteredElement = element.className.match('Header.{2}Title.*');
          if (!filteredElement) {
            return false;
          }
          return true;
        })
        .contains('Euclid');
    });

    describe('the dropdown works', () => {
      specify('the topic selector works', () => {
        reloadPage();
        getSearchArea()
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
        reloadPage();
        getSearchArea()
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
        reloadPage();
        getReactSelectOptionWithIndex('Search', 1);
      });
    });

    specify('the search selector works for AAPL', () => {
      reloadPage();
      getSearchArea()
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
});

export {};
