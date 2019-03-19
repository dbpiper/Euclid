import { series } from 'gulp';
import terminalSpawn from 'terminal-spawn';
import waitOn from 'wait-on';

// monkey-patch parallel to be series
const parallel = series;

/* *****************************************************************************
 * Private
 **************************************************************************** */

// Variables

const _clientUrl = 'http://localhost:5000';
const _storybookUrl = 'http://localhost:6006';
const _serverUrl = 'http://localhost:4000';
const _sleepPreviewSeconds = 8;
const _clientDirectory = 'src/client';
const _serverDirectory = 'src/server';

const _commands = {
  npm: {
    install: 'npm install',
    ci: 'npm ci',
    start: 'npm run start',
    preCommit: 'npm run preCommit',
    startServerProduction: 'npm run startProduction',
    cypressE2eRun: 'npm run cypress:e2e:run',
    cypressStorybookRun: 'npm run cypress:storybook:run',
  },
};

// Spawns

// not a gulp task!
const _runStorybook = () =>
  terminalSpawn('npm run storybook', { cwd: _clientDirectory, shell: false });

// not a gulp task!
const _serverStart = () =>
  terminalSpawn(_commands.npm.startServerProduction, {
    cwd: _serverDirectory,
    shell: false,
  });

// not a gulp task!
const _clientStart = () =>
  terminalSpawn(_commands.npm.start, { cwd: _clientDirectory, shell: false });

// Tasks

const _cypressStorybookRun = () =>
  terminalSpawn(_commands.npm.cypressStorybookRun, {
    cwd: _clientDirectory,
    shell: false,
  }).promise;

const _cypressE2eRun = () =>
  terminalSpawn(_commands.npm.cypressE2eRun, {
    cwd: _clientDirectory,
    shell: false,
  }).promise;

const _waitOnUrl = async (url: string) =>
  waitOn({
    resources: [url],
  });

// Cypress

const _testStorybook = async () =>
  new Promise(async (resolve, reject) => {
    try {
      const storybookSpawn = _runStorybook();
      storybookSpawn.promise.catch(reason => reject(reason));
      await _waitOnUrl(_storybookUrl);
      const cypressProcess = await _cypressStorybookRun();
      storybookSpawn.process.kill();
      await storybookSpawn.promise;

      if (cypressProcess.status !== 0) {
        reject(cypressProcess.status);
      } else {
        resolve(0);
      }
    } catch (error) {
      reject(error);
    }
  });

const _testEuclidE2e = async () =>
  new Promise(async (resolve, reject) => {
    try {
      const serverSpawn = _serverStart();
      serverSpawn.promise.catch(reason => reject(reason));
      await _waitOnUrl(_serverUrl);
      const clientSpawn = _clientStart();
      clientSpawn.promise.catch(reason => reject(reason));
      await _waitOnUrl(_clientUrl);
      const cypressProcess = await _cypressE2eRun();

      serverSpawn.process.kill();
      clientSpawn.process.kill();
      await serverSpawn.promise;
      await clientSpawn.promise;

      if (cypressProcess.status !== 0) {
        reject(cypressProcess.status);
      } else {
        resolve(cypressProcess.status);
      }
    } catch (error) {
      reject(error);
    }
  });

const _runCypressTests = series(_testStorybook, _testEuclidE2e);

// Client

const _clientInstall = () =>
  terminalSpawn(_commands.npm.install, {
    cwd: _clientDirectory,
    shell: false,
  }).promise;

const _clientInstallCi = () =>
  terminalSpawn(_commands.npm.ci, {
    cwd: _clientDirectory,
    shell: false,
  }).promise;

const _clientPreCommit = () =>
  terminalSpawn(_commands.npm.preCommit, {
    cwd: _serverDirectory,
    shell: false,
  }).promise;

// Server

const _serverInstall = () =>
  terminalSpawn(_commands.npm.install, { cwd: _serverDirectory, shell: false })
    .promise;

const _serverInstallCi = () =>
  terminalSpawn(_commands.npm.ci, { cwd: _serverDirectory, shell: false })
    .promise;

const _serverPreCommit = () =>
  terminalSpawn(_commands.npm.preCommit, {
    cwd: _serverDirectory,
    shell: false,
  }).promise;

// Root

const _npmInstall = () =>
  terminalSpawn(_commands.npm.install, { shell: false }).promise;

const _npmCi = () => terminalSpawn(_commands.npm.ci, { shell: false }).promise;

const _gitStatus = () => terminalSpawn('git status', { shell: false }).promise;

const _sleep = (seconds: number) =>
  terminalSpawn(`sleep ${seconds}`, { shell: false }).promise;

const _sleepForPreview = () => _sleep(_sleepPreviewSeconds);

// Root Combination Tasks

const _gitReview = series(_gitStatus, _sleepForPreview);

const _postInstallStandard = parallel(_clientInstall, _serverInstall);

const _postinstallCi = parallel(_clientInstallCi, _serverInstallCi);

const _clientServerPreCommit = parallel(_clientPreCommit, _serverPreCommit);

/* *****************************************************************************
 * Public
 **************************************************************************** */

// Root

const install = series(_npmInstall, _postInstallStandard);

const installCi = series(_npmCi, _postinstallCi);

const preCommit = series(
  _gitReview,
  parallel(_clientServerPreCommit, _runCypressTests),
);

export { install, installCi, preCommit };

export default preCommit;
