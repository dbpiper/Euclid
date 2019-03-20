import { parallel, series } from 'gulp';
import terminalSpawn from 'terminal-spawn';

// Miscellaneous Helper Tasks

const generateGraphQlTypes = () =>
  terminalSpawn('npx babel-node scripts/generateGraphQLTypes.js').promise;

const schemaDownload = () =>
  terminalSpawn('npx babel-node scripts/downloadSchema.js');

// Static Checking

const _checkTypes = () => terminalSpawn('npx tsc').promise;

const _lintES = () => terminalSpawn('npx eslint .').promise;

const _lintTS = () =>
  terminalSpawn(
    'npx tslint "./**/*.ts?(x)" "src/**/*.ts?(x)" --project tsconfig.json',
  ).promise;

const lint = parallel(_lintES, _lintTS, _checkTypes);

const build = () => terminalSpawn('node scripts/build.js').promise;

// Building and Running

const startDevelopment = () => terminalSpawn('node scripts/start.js').promise;

// Storybook

const storybookBuild = () => terminalSpawn('build-storybook').promise;

const storybookStart = () =>
  terminalSpawn('start-storybook -p 6006 --ci').promise;

// Cypress

const cypressStorybookOpen = () =>
  terminalSpawn(
    'npx cypress open --config integrationFolder=cypress/integration/storybook',
  ).promise;

const cypressStorybookRun = () =>
  terminalSpawn(
    'npx cypress run --config integrationFolder=cypress/integration/storybook',
  ).promise;

const cypressE2eOpen = () =>
  terminalSpawn(
    'npx cypress open --config integrationFolder=cypress/integration/end-to-end',
  ).promise;

const cypressE2eRun = () =>
  terminalSpawn(
    'npx cypress run --config integrationFolder=cypress/integration/end-to-end',
  ).promise;

// Testing

const test = () => terminalSpawn('node scripts/test.js').promise;

const testWatch = () => terminalSpawn('node scripts/test.js --watch').promise;

const preCommit = series(build, lint, test);

export {
  preCommit,
  test,
  testWatch,
  cypressE2eRun,
  cypressE2eOpen,
  cypressStorybookRun,
  cypressStorybookOpen,
  storybookStart,
  startDevelopment,
  storybookBuild,
  lint,
  schemaDownload,
  generateGraphQlTypes,
  build,
};

export default startDevelopment;

// "build": "node scripts/build.js",
// "build-storybook": "build-storybook",
// "check-types": "tsc",
// "cypress:e2e:open": "npx cypress open --config integrationFolder=cypress/integration/end-to-end",
// "cypress:e2e:run": "npx cypress run --config integrationFolder=cypress/integration/end-to-end",
// "cypress:storybook:open": "npx cypress open --config integrationFolder=cypress/integration/storybook",
// "cypress:storybook:run": "npx cypress run --config integrationFolder=cypress/integration/storybook",
// "generate:graphql-types": "babel-node scripts/generateGraphQLTypes.js",
// "lint": "npm run lintES && npm run lintTS",
// "lintES": "npx eslint .",
// "lintTS": "npx tslint \"./**/*.ts?(x)\" \"src/**/*.ts?(x)\" --project tsconfig.json",
// "preCommit": "npm run build && npm run staticCheckAndTest",
// "schema:download": "babel-node scripts/downloadSchema.js",
// "start": "node scripts/start.js",
// "staticCheck": "npm run lint && npm run check-types",
// "staticCheckAndTest": "npm run staticCheck && npm run test",
// "storybook": "start-storybook -p 6006 --ci",
// "test": "node scripts/test.js",
// "test:watch": "node scripts/test.js --watch"
