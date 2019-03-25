import { series } from 'gulp';
import path from 'path';
import terminalSpawn from 'terminal-spawn';
import ServerCommands from './config/server-commands';

const _dotenvPath = path.join(__dirname, '..', '..', '.env');

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

const lint = series(_lintES, _lintTS, checkTypes);

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

const downloadData = async () => {
  await terminalSpawn('npx gulp build').promise;

  return terminalSpawn(
    `node -r dotenv/config dist/index.js \
        dotenv_config_path=${_dotenvPath} -- --download-data`,
  ).promise;
};

const start = async () => {
  await terminalSpawn('npx gulp build').promise;

  return terminalSpawn(ServerCommands.start(_dotenvPath)).promise;
};

const startProduction = async () => {
  await terminalSpawn('npx gulp build').promise;

  return terminalSpawn(ServerCommands.startProduction(_dotenvPath)).promise;
};

const preCommit = series(lint, test);

export {
  lint,
  test,
  build,
  testWatch,
  preCommit,
  checkTypes,
  start,
  startProduction,
  downloadData,
};

export default preCommit;
