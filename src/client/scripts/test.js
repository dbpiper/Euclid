// const { execSync } = require('child_process');

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


const argumentsToRemove = 2;
const argv = process.argv.slice(argumentsToRemove);

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
