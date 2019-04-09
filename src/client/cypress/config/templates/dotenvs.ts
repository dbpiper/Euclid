/**
 * Gets the storybook url based on the environment variables set.
 *
 */
const getStorybookUrl = () =>
  // this is a template, it will be replaced with real values before it is run
  // eslint-disable-next-line no-undef
  `${STORYBOOK_PROTOCOL}://${STORYBOOK_ADDRESS}:${STORYBOOK_PORT}`;

export {
  // eslint-disable-next-line import/prefer-default-export
  getStorybookUrl
};
