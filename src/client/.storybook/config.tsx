import { withKnobs } from '@storybook/addon-knobs';
import { addDecorator, configure, setAddon } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';

addDecorator(withKnobs);
setAddon(JSXAddon);

// automatically import all files ending in *.stories.js
const req = require.context(
  '../src',
  true,
  /^(?=.*\/__stories__\/.*)(?=.*.stories.tsx).*$/,
);

const loadStories = () => {
  // we have to disable because we don't know the type
  // ahead of time as it could be anything, thus we must use any
  // tslint:disable-next-line: no-unsafe-any
  req.keys().forEach(filename => req(filename));
};

configure(loadStories, module);
