const ServerCommands = Object.freeze({
  __proto__: null,
  start: (dotenvPath: string) =>
    `node -r dotenv/config dist/index.js dotenv_config_path=${dotenvPath}`,
  startProduction: (dotenvPath: string) => `\
    node -r dotenv/config dist/index.js  \
      dotenv_config_path=${dotenvPath}   \
      --production
  `,
});

export default ServerCommands;
