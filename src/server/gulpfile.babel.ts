import { parallel, series } from 'gulp';
import terminalSpawn from 'terminal-spawn';

const checkTypes = async () =>
  terminalSpawn('npx tsc -p ./tsconfig.json', {
    shell: false,
  }).promise;

const lintES = async () =>
  terminalSpawn('npx eslint .', { shell: false }).promise;

const lintTS = async () => {
  const rootFiles = '"./*.ts?(x)"';
  const srcFiles = '"./src/**/*.ts?(x)"';
  const configFiles = '"./config/**/*.ts?(x)"';
  const tsconfig = '--project tsconfig.json';
  return terminalSpawn(
    `npx tslint ${rootFiles} ${srcFiles} ${configFiles} ${tsconfig}`,
    {
      shell: false,
    },
  ).promise;
};

const lint = parallel(lintES, lintTS);

const test = async () => terminalSpawn('npx jest', { shell: false }).promise;

const staticCheck = series(lint, checkTypes);

const staticCheckAndTest = series(staticCheck, test);

const build = () =>
  terminalSpawn(`
    npx                                     \
      babel                                 \
        .                                   \
        --ignore node_modules               \
        --extensions .ts                    \
        --out-dir dist                      \
        --delete-dir-on-start               \
  `).promise;

const testWatch = () => terminalSpawn('jest --watch', { shell: false }).promise;

const startNodemon = () =>
  terminalSpawn('nodemon --exec babel-node --extensions ".ts" index.js', {
    shell: false,
  }).promise;

const preCommit = staticCheckAndTest;

export {
  checkTypes,
  lintES,
  lintTS,
  lint,
  test,
  staticCheckAndTest,
  staticCheck,
  build,
  testWatch,
  startNodemon,
  preCommit,
};

export default preCommit;
