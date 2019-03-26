const getCompareSnapshotsPlugin = require('cypress-visual-regression/dist/plugin');
const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor');

module.exports = (on) => {
  on('file:preprocessor', cypressTypeScriptPreprocessor);
  getCompareSnapshotsPlugin(on);
};
