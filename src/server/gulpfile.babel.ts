import { parallel, series } from 'gulp';
import terminalSpawn from 'terminal-spawn';

const checkTypes = () => terminalSpawn('npx tsc -p "./tsconfig.json"');

const lintES = () => terminalSpawn('npx eslint .');

const lintTS = () => {
  const rootFiles = '"./*.ts?(x)"';
  const srcFiles = '"./src/**/*.ts?(x)"';
  const configFiles = '"./config/**/*.ts?(x)"';
  const tsconfig = '--project tsconfig.json';
  return terminalSpawn(
    `npx tslint ${rootFiles} ${srcFiles} ${configFiles} ${tsconfig}`,
  );
};

const lint = parallel(lintES, lintTS);

const test = () => terminalSpawn('npx jest');

const staticCheck = series(lint, checkTypes);

const staticCheckAndTest = series(staticCheck, test);

const start = (args: string) => {
  let validatedArgs = '';
  // make sure it isn't the implicit 'cb' function arg
  if (typeof args === 'string') {
    validatedArgs = args;
  }

  return terminalSpawn(
    `npx babel-node index.ts --extensions ".ts" ${validatedArgs}`,
  );
};

const startProduction = () => start('-- --production');

const build = () => start('-- --build');

const testWatch = () => terminalSpawn('jest --watch');

const downloadData = () => start('-- --download-data');

const debug = () => start('-- --inspect');

const startNodemon = () =>
  terminalSpawn('nodemon --exec babel-node --extensions ".ts" index.js');

const preCommit = series(build, staticCheckAndTest);

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
  build,
  testWatch,
  downloadData,
  debug,
  startNodemon,
  preCommit,
};

export default start;
