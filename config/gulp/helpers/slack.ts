// tslint:disable-next-line: no-reference
/// <reference path="../../types/slack-notify/index.d.ts" />

import moment from 'moment';
import slackNotify from 'slack-notify';

import SlackInfo from './slack-info';

let _startTime: moment.Moment;

const _getNiceString = (timeTakenMs: number) => {
  const timeTaken = moment.duration(timeTakenMs, 'milliseconds');
  const millisecondsInSecond = 1000;

  if (timeTaken.seconds() < 1) {
    return `${timeTaken.milliseconds()} milliseconds`;
  }
  if (timeTaken.minutes() < 1) {
    return `${timeTaken.seconds() +
      timeTaken.milliseconds() / millisecondsInSecond} seconds`;
  }

  return `${timeTaken.minutes()} minutes, ${timeTaken.seconds() +
    timeTaken.milliseconds() / millisecondsInSecond} seconds`;
};

const _getSlackMessage = (success: boolean) => {
  const _endTime = moment();

  let message: string = '';

  const timeTakenMs = _endTime.diff(_startTime);
  const timeTakenString = _getNiceString(timeTakenMs);

  if (typeof success === 'boolean') {
    if (success) {
      message = `Verification script finished successfully in ${timeTakenString}.`;
    } else {
      message = `Verification script failed after ${timeTakenString}!`;
    }
  }

  return message;
};

const _slackSendMessageNetwork = (resolve: () => void, message: string) => {
  const _slack = slackNotify(SlackInfo.url);
  console.log('sending slack message...');
  _slack.send(
    {
      channel: SlackInfo.channel,
      text: message,
    },
    () => {
      console.warn('done sending slack message...');
      resolve();
    },
  );
};

const slackSendMessage = (success: boolean = true) =>
  new Promise((resolve, _reject) => {
    const message = _getSlackMessage(success);

    _slackSendMessageNetwork(resolve, message);
  });

const startTimer = () => {
  _startTime = moment();
};

export { startTimer, slackSendMessage };
