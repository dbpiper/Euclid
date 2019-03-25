import './loadDotenv.ts';

const ClientCommands = Object.freeze({
  __proto__: null,
  startStorybook: `npx start-storybook -p ${process.env.STORYBOOK_PORT} --ci`,
  serveClient: `npx serve -s build`,
});

export default ClientCommands;
