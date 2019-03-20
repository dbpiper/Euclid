import { parallel, series } from 'gulp';
import isReachable from 'is-reachable';
import terminalSpawn from 'terminal-spawn';
import waitOn from 'wait-on';

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
  terminalSpawn('npm run storybook:start', {
    cwd: _clientDirectory,
  });

// not a gulp task!
const _serverStart = () =>
  terminalSpawn(_commands.npm.startServerProduction, {
    cwd: _serverDirectory,
  });

// not a gulp task!
const _clientStart = () =>
  terminalSpawn(_commands.npm.start, { cwd: _clientDirectory });

// Tasks

const _cypressStorybookRun = () =>
  terminalSpawn(_commands.npm.cypressStorybookRun, {
    cwd: _clientDirectory,
  }).promise;

const _cypressE2eRun = () =>
  terminalSpawn(_commands.npm.cypressE2eRun, {
    cwd: _clientDirectory,
  }).promise;

const _waitOnUrl = async (url: string, reverse: boolean = false) =>
  waitOn({
    reverse,
    resources: [url],
  });

const _isUrlUp = async (url: string) => isReachable(url);

// Cypress

const _testStorybook = async () =>
  new Promise(async (resolve, reject) => {
    try {
      const isStorybookAlreadyRunning = await _isUrlUp(_storybookUrl);
      if (isStorybookAlreadyRunning) {
        reject('storybook is already running!!');
      } else {
        const storybookSpawn = _runStorybook();
        storybookSpawn.promise.catch(reason => reject(reason));
        await _waitOnUrl(_storybookUrl);
        const cypressProcess = await _cypressStorybookRun();
        storybookSpawn.process.kill();
        await _waitOnUrl(_storybookUrl, true);

        if (cypressProcess.status !== 0) {
          reject(cypressProcess.status);
        } else {
          resolve(0);
        }
      }
    } catch (error) {
      reject(error);
    }
  });

const _testEuclidE2e = async () =>
  new Promise(async (resolve, reject) => {
    try {
      const isServerAlreadyRunning = await _isUrlUp(_serverUrl);
      if (isServerAlreadyRunning) {
        reject('server is already running!!');
      } else {
        const serverSpawn = _serverStart();
        serverSpawn.promise.catch(reason => reject(reason));
        await _waitOnUrl(_serverUrl);

        const isClientAlreadyRunning = await _isUrlUp(_clientUrl);
        if (isClientAlreadyRunning) {
          reject('client is already running!!');
        } else {
          const clientSpawn = _clientStart();
          clientSpawn.promise.catch(reason => reject(reason));
          await _waitOnUrl(_clientUrl);
          const cypressProcess = await _cypressE2eRun();

          serverSpawn.process.kill();
          clientSpawn.process.kill();
          await _waitOnUrl(_serverUrl, true);
          await _waitOnUrl(_clientUrl, true);

          if (cypressProcess.status !== 0) {
            reject(cypressProcess.status);
          } else {
            resolve(cypressProcess.status);
          }
        }
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
  }).promise;

const _clientInstallCi = () =>
  terminalSpawn(_commands.npm.ci, {
    cwd: _clientDirectory,
  }).promise;

const _clientPreCommit = () =>
  terminalSpawn(_commands.npm.preCommit, {
    cwd: _clientDirectory,
  }).promise;

// Server

const _serverInstall = () =>
  terminalSpawn(_commands.npm.install, { cwd: _serverDirectory }).promise;

const _serverInstallCi = () =>
  terminalSpawn(_commands.npm.ci, { cwd: _serverDirectory }).promise;

const _serverPreCommit = () =>
  terminalSpawn(_commands.npm.preCommit, {
    cwd: _serverDirectory,
  }).promise;

// Root

const _gitStatus = () => terminalSpawn('git status').promise;

const _sleep = (seconds: number) => terminalSpawn(`sleep ${seconds}`).promise;

const _sleepForPreview = () => _sleep(_sleepPreviewSeconds);

// Root Combination Tasks

const _gitReview = series(_gitStatus, _sleepForPreview);

const _clientServerPreCommit = parallel(_clientPreCommit, _serverPreCommit);

/* *****************************************************************************
 * Public
 **************************************************************************** */

// Root

const postInstallStandard = parallel(_clientInstall, _serverInstall);

const postinstallCi = parallel(_clientInstallCi, _serverInstallCi);

const preCommit = series(
  _gitReview,
  parallel(_clientServerPreCommit, _runCypressTests),
);

export {
  postInstallStandard,
  postinstallCi,
  preCommit,
  _clientServerPreCommit,
};

export default preCommit;
