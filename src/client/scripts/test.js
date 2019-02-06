// const { execSync } = require('child_process');

// Preload `cli` to avoid cyclical dependency
// workaround for [jest issue#7704](https://github.com/facebook/jest/issues/7704)
// eslint-disable-next-line import/no-extraneous-dependencies
require('jest/node_modules/jest-cli/build/cli');

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

// Ensure environment variables are read.
require('../config/env');

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (error) => {
  throw error;
});


const argsToGet = 2;
const argv = process.argv.slice(argsToGet);

// function isInGitRepository() {
//   try {
//     execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
//     return true;
//   } catch (error) {
//     return false;
//   }
// }

// function isInMercurialRepository() {
//   try {
//     execSync('hg --cwd . root', { stdio: 'ignore' });
//     return true;
//   } catch (error) {
//     return false;
//   }
// }

// // Watch unless on CI, in coverage mode, or explicitly running all tests
// if (
//   !process.env.CI
//   && argv.indexOf('--coverage') === -1
//   && argv.indexOf('--watchAll') === -1
// ) {
//   // https://github.com/facebook/create-react-app/issues/5210
//   const hasSourceControl = isInGitRepository() || isInMercurialRepository();
//   argv.push(hasSourceControl ? '--watch' : '--watchAll');
// }

// eslint-disable-next-line import/no-extraneous-dependencies, jest/no-jest-import
require('jest').run(argv);
