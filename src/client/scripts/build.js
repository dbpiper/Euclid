/* eslint-disable no-console */

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (error) => {
  throw error;
});

// Ensure environment variables are read.
require('../config/env');

const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const bfj = require('bfj');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printBuildError = require('react-dev-utils/printBuildError');
const {
  checkBrowsers,
} = require('react-dev-utils/browsersHelper');
const configFactory = require('../config/webpack.config');
const paths = require('../config/paths');

const {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild,
} = FileSizeReporter;

const medSize2To9 = 512;
const lgSize2To10 = 1024;
// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = medSize2To9 * lgSize2To10;
const WARN_AFTER_CHUNK_GZIP_SIZE = lgSize2To10 * lgSize2To10;

const isInteractive = process.stdout.isTTY;

const noWarnings = 0;
const errorExitCode = 1;
const endSpecial = -1;
const argumentsToSkip = 2;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(errorExitCode);
}

// Process CLI arguments
const argv = process.argv.slice(argumentsToSkip);
const writeStatsJson = argv.indexOf('--stats') !== endSpecial;

// Generate configuration
const config = configFactory('production');

const copyPublicFolder = () => (
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  })
);


// Create the production build and print the deployment instructions.
const build = (previousFileSizes) => {
  console.log('Creating an optimized production build...');

  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      let messages;
      if (error) {
        if (!error.message) {
          return reject(error);
        }
        messages = formatWebpackMessages({
          errors: [error.message],
          warnings: [],
        });
      } else {
        messages = formatWebpackMessages(
          stats.toJson({
            all: false,
            warnings: true,
            errors: true,
          }),
        );
      }
      const noErrors = 0;

      if (messages.errors.length > noErrors) {
        const firstError = 1;

        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > firstError) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }

      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length > noWarnings
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
            'Most CI servers set it automatically.\n',
          ),
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }

      const resolveArguments = {
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      };
      if (writeStatsJson) {
        return bfj
          .write(`${paths.appBuild} /bundle-stats.json`, stats.toJson())
          .then(() => resolve(resolveArguments))
          .catch(error2 => reject(new Error(error2)));
      }

      return resolve(resolveArguments);
    });
  });
};

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
checkBrowsers(paths.appPath, isInteractive)
  .then(() => (
    // First, read the current file sizes in build directory.
    // This lets us display how much they changed later.
    measureFileSizesBeforeBuild(paths.appBuild)
  ))
  .then((previousFileSizes) => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuild);
    // Merge with the public folder
    copyPublicFolder();
    // Start the webpack build
    return build(previousFileSizes);
  })
  .then(
    ({
      stats,
      previousFileSizes,
      warnings,
    }) => {
      if (warnings.length > noWarnings) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          `\nSearch for the ${chalk.underline(chalk.yellow('keywords'))} \
          to learn more about each warning.`,
        );
        console.log(
          `To ignore, add ${chalk.cyan('// eslint-disable-next-line')} \
          to the line before.\n`,
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }

      console.log('File sizes after gzip:\n');
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        paths.appBuild,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE,
      );
    },
    (error) => {
      console.log(chalk.red('Failed to compile.\n'));
      printBuildError(error);
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(errorExitCode);
    },
  )
  .catch((error) => {
    if (error && error.message) {
      console.log(error.message);
    }
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(errorExitCode);
  });
