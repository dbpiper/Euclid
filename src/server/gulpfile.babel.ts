import { parallel, series } from 'gulp';
import terminalSpawn from 'terminal-spawn';

const checkTypes = async () =>
  terminalSpawn('npx tsc -p ./tsconfig.json').promise;

const _lintES = async () => terminalSpawn('npx eslint .').promise;

const _lintTS = async () => {
  const rootFiles = '"./*.ts?(x)"';
  const srcFiles = '"./src/**/*.ts?(x)"';
  const configFiles = '"./config/**/*.ts?(x)"';
  const tsconfig = '--project tsconfig.json';
  return terminalSpawn(
    `npx tslint ${rootFiles} ${srcFiles} ${configFiles} ${tsconfig}`,
  ).promise;
};

const lint = parallel(_lintES, _lintTS, checkTypes);

const test = async () => terminalSpawn('npx jest').promise;

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

const testWatch = () => terminalSpawn('jest --watch').promise;

const startNodemon = () =>
  terminalSpawn('nodemon --exec babel-node --extensions ".ts" index.js')
    .promise;

const preCommit = series(lint, test);

export { lint, test, build, testWatch, startNodemon, preCommit, checkTypes };

export default preCommit;
