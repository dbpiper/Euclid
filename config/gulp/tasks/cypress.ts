// tslint:disable: no-console

import {
  seriesPromise,
  // tslint:disable-next-line: no-implicit-dependencies
} from 'gulp-errorable';
import isReachable from 'is-reachable';
import path from 'path';
import terminalSpawn from 'terminal-spawn';
import waitOn from 'wait-on';

import ClientCommands from '../../../src/client/config/client-commands';
import ServerCommands from '../../../src/server/config/server-commands';

// -----------------------------------------------------------------------------
// Variables
// -----------------------------------------------------------------------------

const _dotenvPath = path.join(__dirname, '..', '..', '..', '.env');

const _clientUrl = `${process.env.CLIENT_PROTOCOL}://${
  process.env.CLIENT_ADDRESS
}:${process.env.CLIENT_PORT}`;
const _serverUrl = `${process.env.SERVER_PROTOCOL}://${
  process.env.SERVER_ADDRESS
}:${process.env.SERVER_PORT}`;
const _storybookUrl = `${process.env.STORYBOOK_PROTOCOL}://${
  process.env.STORYBOOK_ADDRESS
}:${process.env.STORYBOOK_PORT}`;

const _clientDirectory = 'src/client';
const _cypressDirectory = 'src/client/cypress';
const _serverDirectory = 'src/server';

const _commands = {
  npm: {
    install: 'npm install',
    ci: 'npm ci',
    preCommit: 'npm run preCommit',
    cypressE2eRun: 'npm run cypress:e2e:run',
    cypressStorybookRun: 'npm run cypress:storybook:run',
    cypressStorybookUpdateSnapshots:
      'npm run cypress:storybook:update-snapshots',
  },
};

const _waitOnUrl = async (url: string, reverse: boolean = false) =>
  waitOn({
    reverse,
    resources: [url],
  });

// -----------------------------------------------------------------------------
// Spawns
// -----------------------------------------------------------------------------

// not a gulp task!
const _serverStart = async () => {
  console.log('building server...');
  await terminalSpawn('npm run build', {
    cwd: _serverDirectory,
  }).promise;
  console.log('server built successfully');

  console.log('running node server...');
  // this has to be run directly, not through npm or gulp
  // as otherwise `node` won't be killed by `process.kill`!
  return terminalSpawn(ServerCommands.start(_dotenvPath), {
    cwd: _serverDirectory,
    shell: false,
  });
};

// not a gulp task!
const _clientStart = async () => {
  console.log('building client...');
  await terminalSpawn('npm run build', {
    cwd: _clientDirectory,
  }).promise;
  console.log('client built successfully');

  console.log('serving client...');
  // this has to be run directly, not through npm or gulp
  // as otherwise `serve` won't be killed by `process.kill`!
  return terminalSpawn(ClientCommands.serveClient, {
    cwd: _clientDirectory,
    shell: false,
  });
};

// not a gulp task!
const _runStorybook = () =>
  // this has to be run directly, not through npm or gulp
  // as otherwise `start-storybook` won't be killed by `process.kill`!
  terminalSpawn(ClientCommands.startStorybook, {
    cwd: _clientDirectory,
    shell: false,
  });

// -----------------------------------------------------------------------------
// Tasks
// -----------------------------------------------------------------------------

const _cypressStorybookRun = () =>
  terminalSpawn(_commands.npm.cypressStorybookRun, {
    cwd: _clientDirectory,
  }).promise;

const _cypressStorybookUpdateSnapshots = () =>
  terminalSpawn(_commands.npm.cypressStorybookUpdateSnapshots, {
    cwd: _clientDirectory,
  }).promise;

const _cypressE2eRun = () =>
  terminalSpawn(_commands.npm.cypressE2eRun, {
    cwd: _clientDirectory,
  }).promise;

const _testStorybook = async () =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('running Storybook integration tests');
      const isStorybookAlreadyRunning = await isReachable(_storybookUrl);
      if (isStorybookAlreadyRunning) {
        reject(new Error('storybook is already running!!'));
      } else {
        console.log('starting Storybook...');
        const storybookSpawn = _runStorybook();
        storybookSpawn.promise.catch(reason => reject(reason));
        await _waitOnUrl(_storybookUrl);
        console.log('Storybook is up');

        const cypressProcess = await _cypressStorybookRun();
        console.log('cypress Storybook integration tests finished running');

        console.log('killing storybook...');
        storybookSpawn.process.kill();
        await _waitOnUrl(_storybookUrl, true);
        console.log('Storybook successfully killed and is now down');

        if (cypressProcess.status !== 0) {
          reject(
            new Error(
              `The cypress Storybook integration test process exited abnormally\
               with a non-zero exit code: ${cypressProcess.status}`,
            ),
          );
        } else {
          resolve(
            'cypress Storybook integration test process completed successfully',
          );
        }
      }
    } catch (error) {
      reject(error);
    }
  });

const _testEuclidE2e = async () =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('running Euclid end-to-end tests');
      const isServerAlreadyRunning = await isReachable(_serverUrl);
      if (isServerAlreadyRunning) {
        reject(new Error('server is already running!!'));
      } else {
        console.log('starting server...');
        const serverSpawn = await _serverStart();
        serverSpawn.promise.catch(reason => reject(reason));
        await _waitOnUrl(_serverUrl);
        console.log('server is up');

        const isClientAlreadyRunning = await isReachable(_clientUrl);
        if (isClientAlreadyRunning) {
          reject(new Error('client is already running!!'));
        } else {
          console.log('starting client...');
          const clientSpawn = await _clientStart();
          clientSpawn.promise.catch(reason => reject(new Error(reason)));
          await _waitOnUrl(_clientUrl);
          console.log('client is up');

          const cypressProcess = await _cypressE2eRun();
          console.log('cypress e2e tests finished running');

          console.log('killing server...');
          serverSpawn.process.kill();
          console.log('killing client...');
          clientSpawn.process.kill();

          await _waitOnUrl(_serverUrl, true);
          console.log('server successfully killed and is now down');
          await _waitOnUrl(_clientUrl, true);
          console.log('client successfully killed and is now down');

          if (cypressProcess.status !== 0) {
            reject(
              new Error(
                `The cypress e2e test process exited abnormally with a non-zero\
                 exit code: ${cypressProcess.status}`,
              ),
            );
          } else {
            resolve('cypress e2e test process completed successfully');
          }
        }
      }
    } catch (error) {
      reject(error);
    }
  });

const updateCypressStorybookSnapshots = async () =>
  new Promise(async (resolve, reject) => {
    try {
      console.log('running Storybook snapshot update');
      const isStorybookAlreadyRunning = await isReachable(_storybookUrl);
      if (isStorybookAlreadyRunning) {
        reject(new Error('storybook is already running!!'));
      } else {
        console.log('starting Storybook...');
        const storybookSpawn = _runStorybook();
        storybookSpawn.promise.catch(reason => reject(reason));
        await _waitOnUrl(_storybookUrl);
        console.log('Storybook is up');

        const cypressProcess = await _cypressStorybookUpdateSnapshots();
        console.log('cypress Storybook snapshot update finished running');

        console.log('killing storybook...');
        storybookSpawn.process.kill();
        await _waitOnUrl(_storybookUrl, true);
        console.log('Storybook successfully killed and is now down');

        if (cypressProcess.status !== 0) {
          reject(
            new Error(
              `The cypress Storybook snapshot update process exited abnormally\
               with a non-zero exit code: ${cypressProcess.status}`,
            ),
          );
        } else {
          resolve(
            'cypress Storybook snapshot update process completed successfully',
          );
        }
      }
    } catch (error) {
      reject(error);
    }
  });

const runCypressTests = seriesPromise({
  name: 'runCypressTests',
  tasks: [_testStorybook, _testEuclidE2e],
});

const cypressInstall = () =>
  terminalSpawn(_commands.npm.install, {
    cwd: _cypressDirectory,
  }).promise;

const cypressInstallCi = () =>
  terminalSpawn(_commands.npm.install, {
    cwd: _cypressDirectory,
  }).promise;

export {
  updateCypressStorybookSnapshots,
  runCypressTests,
  cypressInstall,
  cypressInstallCi,
};
