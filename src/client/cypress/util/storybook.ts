import { getStorybookUrl } from '../config/dotenvs';

/**
 * Get the internal storybook id of the component, this is needed to
 * open the iframe as its src attribute is unreliable and sometimes appears
 * to be just '+' which isn't helpful for Cypress purposes.
 *
 * This **is** a workaround and it *could* potentially break with an update
 * to Storybook, however I do think that it is the best option given what
 * we have to work with (no official iframe support from Cypress).
 *
 * @param {string} componentName The name of the component to grab the id of
 */
const _getComponentId = (componentName: string) => {
  const lowerCaseName: string = componentName.toLowerCase();
  const typedName = cy
    .get('input')
    .should('have.attr', 'placeholder', 'Press "/" to search...')
    .type(componentName);
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
  });
};

/**
 * Navigates cypress to the iframe containing the storybook story
 * preview. This uses the alias of the component which Cypress gets
 * in the `getComponentId` function.
 *
 * @param {string} storybookUrl The base url of the running storybook
 */
const _navigateToStorybookIFrame = (storybookUrl: string) => {
  cy.get('@ComponentId').then(componentId => {
    const iframeUrl = `iframe.html?id=${componentId}`;
    cy.visit(`${storybookUrl}/${iframeUrl}`, {
      timeout: Cypress.config('pageLoadTimeout'),
    });
  });
};

/**
 * Opens the Storybook story for the given component. Rather than
 * opening in the normal storybook way, how a user would, it instead
 * opens the component story (which it calls the "preview") directly.
 *
 * This story is actually in an iframe so it is actually just telling
 * Cypress to visit the iframe url.
 *
 * @param {string} storybookUrl The url of the standard storybook page
 * @param {string} componentName The name of the component to navigate to for
 * testing
 */
const visitComponentStoryIFrame = (
  storybookUrl: string,
  componentName: string,
) => {
  cy.visit(storybookUrl);
  _getComponentId(componentName);
  _navigateToStorybookIFrame(storybookUrl);
};

export { getStorybookUrl, visitComponentStoryIFrame };
