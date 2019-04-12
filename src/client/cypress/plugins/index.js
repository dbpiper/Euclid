const {
  addMatchImageSnapshotPlugin,
} = require('cypress-image-snapshot/plugin');
const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor');

module.exports = (on, config) => {
  on('file:preprocessor', cypressTypeScriptPreprocessor);
  addMatchImageSnapshotPlugin(on, config);
};
