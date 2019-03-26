import { slackSendMessage } from './slack';

const taskErrorWrapper = <T>(task: () => Promise<T>) =>
  new Promise<T>(async (resolve, reject) => {
    try {
      const result = task();
      resolve(result);
    } catch (error) {
      await slackSendMessage(false);
      reject(error);
    }
  });

export default taskErrorWrapper;
