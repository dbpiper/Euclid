import { parallel, series } from 'gulp';
import terminalSpawn from 'terminal-spawn';

const checkTypes = () => terminalSpawn('npx tsc -p "./tsconfig.json"').promise;

const lintES = () => terminalSpawn('npx eslint .').promise;

const lintTS = () => {
  const rootFiles = '"./*.ts?(x)"';
  const srcFiles = '"./src/**/*.ts?(x)"';
  const configFiles = '"./config/**/*.ts?(x)"';
  const tsconfig = '--project tsconfig.json';
  return terminalSpawn(
    `npx tslint ${rootFiles} ${srcFiles} ${configFiles} ${tsconfig}`,
  ).promise;
};

const lint = parallel(lintES, lintTS);

const test = () => terminalSpawn('npx jest').promise;

const staticCheck = series(lint, checkTypes);

const staticCheckAndTest = series(staticCheck, test);

const start = (args: string) => {
  let validatedArgs = '';
  // make sure it isn't the implicit 'cb' function arg
  if (typeof args === 'string') {
    validatedArgs = args;
  }

  // SIGTERM doesn't kill this, must use SIGINT!
  return terminalSpawn(
    `npx babel-node index.ts --extensions ".ts" ${validatedArgs}`,
  ).promise;
};

const startProduction = () => start('-- --production');

const testWatch = () => terminalSpawn('jest --watch').promise;

const downloadData = () => start('-- --download-data');

const debug = () => start('-- --inspect');

const startNodemon = () =>
  terminalSpawn('nodemon --exec babel-node --extensions ".ts" index.js')
    .promise;

const preCommit = staticCheckAndTest;

export {
  checkTypes,
  lintES,
  lintTS,
  lint,
  test,
  staticCheck,
  staticCheckAndTest,
  start,
  startProduction,
  testWatch,
  downloadData,
  debug,
  startNodemon,
  preCommit,
};

export default start;
