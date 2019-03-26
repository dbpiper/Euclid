// tslint:disable-next-line: no-reference
/// <reference path="config/types/slack-notify/index.d.ts" />

// tslint:disable: no-console
import { registry } from 'gulp';
import {
  ErrorableRegistry,
  ErrorHandlingFunction,
  seriesPromise,
  // tslint:disable-next-line: no-implicit-dependencies
} from 'gulp-errorable';
import terminalSpawn from 'terminal-spawn';

import './config/loadDotenv.ts';

import { slackSendMessage, startTimer } from './config/gulp/helpers/slack';
import {
  cypressInstall,
  cypressInstallCi,
  runCypressTests,
} from './config/gulp/tasks/cypress';

/* *****************************************************************************
 * Private
 **************************************************************************** */

// -----------------------------------------------------------------------------
// Variables
// -----------------------------------------------------------------------------

const _sleepPreviewSeconds = 8;
const _clientDirectory = 'src/client';
const _serverDirectory = 'src/server';

const _commands = {
  npm: {
    install: 'npm install',
    ci: 'npm ci',
    preCommit: 'npm run preCommit',
    cypressE2eRun: 'npm run cypress:e2e:run',
    cypressStorybookRun: 'npm run cypress:storybook:run',
  },
};

const _slackErrorHandler: ErrorHandlingFunction = () => slackSendMessage(false);

// -----------------------------------------------------------------------------
// Gulp Registry
// -----------------------------------------------------------------------------

registry(new ErrorableRegistry(_slackErrorHandler));

// -----------------------------------------------------------------------------
// Tasks
// -----------------------------------------------------------------------------

// Slack

const _slackNotify = async () => {
  const slackPromise = slackSendMessage();
  await slackPromise;
  return Promise.resolve();
};

const _registerSlackNotify = () => {
  startTimer();
  return Promise.resolve();
};

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

const _gitReview = seriesPromise({
  name: '_gitReview',
  tasks: [_gitStatus, _sleepForPreview],
});

const _clientServerPreCommit = seriesPromise({
  name: '_clientServerPreCommit',
  tasks: [_clientPreCommit, _serverPreCommit],
});

/* *****************************************************************************
 * Public
 **************************************************************************** */

// Root

const postInstallStandard = seriesPromise({
  name: 'postInstallStandard',
  tasks: [_clientInstall, cypressInstall, _serverInstall],
});

const postinstallCi = seriesPromise({
  name: 'postinstallCi',
  tasks: [_clientInstallCi, cypressInstallCi, _serverInstallCi],
});

const failMe = () => Promise.reject('failed!!');

const verifyCi = seriesPromise({
  name: 'verifyCi',
  tasks: [_gitReview, _clientServerPreCommit, runCypressTests],
});

const verify = seriesPromise({
  name: 'verify',
  tasks: [_registerSlackNotify, verifyCi, _slackNotify],
});

export { postInstallStandard, postinstallCi, verifyCi, verify };

export default verify;
