import { series } from 'gulp';
import terminalSpawn from 'terminal-spawn';

import './config/loadDotenv.ts';

import ClientCommands from './config/client-commands';

// Miscellaneous Helper Tasks

const generateGraphQlTypes = () =>
  terminalSpawn('npx babel-node scripts/generateGraphQLTypes.js').promise;

const schemaDownload = () =>
  terminalSpawn('npx babel-node scripts/downloadSchema.js').promise;

// Static Checking

const _checkTypes = () => terminalSpawn('npx tsc').promise;

const _lintES = () => terminalSpawn('npx eslint .').promise;

const _lintTS = () =>
  terminalSpawn(
    'npx tslint "./**/*.ts?(x)" "src/**/*.ts?(x)" --project tsconfig.json',
  ).promise;

const lint = series(_lintES, _lintTS, _checkTypes);

const build = () => terminalSpawn('node scripts/build.js').promise;

// Building and Running

const startDevelopment = () => terminalSpawn('node scripts/start.js').promise;

// Storybook

const storybookBuild = () => terminalSpawn('npx build-storybook').promise;

const storybookStart = () =>
  terminalSpawn(ClientCommands.startStorybook).promise;

// Cypress

const cypressStorybookOpen = () =>
  terminalSpawn(
    'npx cypress open --config integrationFolder=cypress/integration/storybook',
  ).promise;

const cypressStorybookRun = () =>
  terminalSpawn(
    'npx cypress run --config integrationFolder=cypress/integration/storybook',
  ).promise;

const cypressStorybookUpdateSnapshots = () =>
  terminalSpawn(
    `npx cypress run \
      --config integrationFolder=cypress/integration/storybook \
      --env updateSnapshots=true \
     `,
  ).promise;

const cypressStorybookOpenUpdateSnapshots = () =>
  terminalSpawn(
    `npx cypress open \
      --config integrationFolder=cypress/integration/storybook \
      --env updateSnapshots=true \
     `,
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
  cypressStorybookUpdateSnapshots,
  cypressStorybookOpenUpdateSnapshots,
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
