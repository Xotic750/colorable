/**
 * @file Utils to assist build mechanism.
 * @copyright Copyright (c) 2017, ProReNata AB
 * @author Graham Fairweather <graham.fairweather@prorenata.se>
 * @module BuildUtils
 * @version 1.0.0
 */

const path = require('path');
const {inspect, promisify} = require('util');
const buffer = require('buffer');
const isString = require('lodash/isString');
const truncate = require('lodash/truncate');
const clamp = require('lodash/clamp');
const get = require('lodash/get');
const toInteger = require('lodash/toInteger');
const castArray = require('lodash/castArray');
const childProcess = require('child_process');
/**
 * @type {Growl}
 */
const notifier = require('node-notifier');
const rimraf = require('rimraf');
const ncp = require('ncp');
const mkdirp = require('mkdirp');

const DEVELOPMENT = 'development';
module.exports.DEVELOPMENT = DEVELOPMENT;

const PRODUCTION = 'production';
module.exports.PRODUCTION = PRODUCTION;

const IS_PRODUCTION = process.env.NODE_ENV === PRODUCTION;
module.exports.IS_PRODUCTION = IS_PRODUCTION;

const INFO = 'info';
module.exports.INFO = INFO;

const WARN = 'warn';
module.exports.WARN = WARN;

const ERROR = 'error';
module.exports.ERROR = ERROR;

const PASSED = 'passed';
module.exports.PASSED = PASSED;

const PRN = 'prn';
module.exports.PRN = PRN;

/**
 * @see {@link https://www.npmjs.com/package/rimraf}
 * @function
 * @param {string} f - Globbing pattern for files.
 * @param {object} [options]
 * @returns {Promise}
 */
const promiseRimraf = promisify(rimraf);
module.exports.promiseRimraf = promiseRimraf;

/**
 * @see {@link https://www.npmjs.com/package/ncp}
 * @function
 * @param {string} source
 * @param {string} destination
 * @param {object} [options]
 * @returns {Promise}
 */
const promiseNcp = promisify(ncp);
module.exports.promiseNcp = promiseNcp;

/**
 * @see {@link https://www.npmjs.com/package/mkdirp}
 * @function
 * @param {string} directory
 * @param {object} [options]
 * @returns {Promise}
 */
const promiseMkdirp = promisify(mkdirp);
module.exports.promiseMkdirp = promiseMkdirp;

/**
 * @type {string}
 * @default ''
 */
const EMPTY_STRING = '';
module.exports.EMPTY_STRING = EMPTY_STRING;

/**
 * @type {string}
 * @default ' '
 */
const SPACE_STRING = ' ';
module.exports.SPACE_STRING = SPACE_STRING;

/**
 * @type {string}
 * @default '\n'
 */
const NEW_LINE = '\n';
module.exports.NEW_LINE = NEW_LINE;

/**
 * @type {string}
 * @default ':::'
 */
const PRE_LOG = ':::';
module.exports.PRE_LOG = PRE_LOG;

/**
 * @type {string}
 * @default ...
 */
const ELLIPSES = '...';
module.exports.ELLIPSES = ELLIPSES;

/**
 * @type {string}
 * @default 'Done.'
 */
const DONE_MSG = Object('Done.');
module.exports.DONE_MSG = DONE_MSG;

/**
 * @type {string}
 * @default 'Failed.'
 */
const FAILED_MSG = Object('Failed.');
module.exports.FAILED_MSG = FAILED_MSG;

/**
 * @type {!object.<string>}
 * @property {string} error - Path to the error image.
 * @property {string} info - Path to the info image.
 * @property {string} warn - Path to the warn image.
 */
const ICONS = Object.freeze(
  Object.create(null, {
    [ERROR]: {
      enumerable: true,
      value: path.resolve('DevTools/error.png'),
    },
    [INFO]: {
      enumerable: true,
      value: path.resolve('DevTools/info.png'),
    },
    [PRN]: {
      enumerable: true,
      value: path.resolve('DevTools/prorenata.png'),
    },
    [PASSED]: {
      enumerable: true,
      value: path.resolve('DevTools/passed.png'),
    },
    [WARN]: {
      enumerable: true,
      value: path.resolve('DevTools/warning.png'),
    },
  }),
);

module.exports.ICONS = ICONS;

/**
 * Gets the value at path of object. If the resolved value is undefined,
 * the defaultValue is returned in its place.
 *
 * @param {object} object - The object to query.
 * @param {(Array|string)} property - The path of the property to get.
 * @param {boolean} [defaultValue=false] - The value returned for undefined resolved values.
 * @returns {boolean} The value coerced to a boolean.
 */
const getBooleanOption = function getBooleanOption(object, property, defaultValue = false) {
  return Boolean(get(object, property, Boolean(defaultValue)));
};

module.exports.getBooleanOption = getBooleanOption;

/**
 * Gets the value at path of object. If the resolved value is undefined,
 * the defaultValue is returned in its place.
 *
 * @param {object} object - The object to query.
 * @param {(Array|string)} property - The path of the property to get.
 * @param {string} [defaultValue=''] - The value returned for undefined resolved values.
 * @returns {string} The value coerced to a string.
 */
const getStringOption = function getStringOption(object, property, defaultValue = EMPTY_STRING) {
  return String(get(object, property, String(defaultValue)));
};

module.exports.getStringOption = getStringOption;

/**
 * Gets the value at path of object. If the resolved value is undefined,
 * the defaultValue is returned in its place.
 *
 * @param {object} object - The object to query.
 * @param {(Array|string)} property - The path of the property to get.
 * @param {number} [defaultValue=0] - The value returned for undefined resolved values.
 * @returns {number} The value coerced to a number.
 */
const getNumberOption = function getNumberOption(object, property, defaultValue = 0) {
  return Number(get(object, property, Number(defaultValue)));
};

module.exports.getNumberOption = getNumberOption;

/**
 * Wrap a string in double quotes.
 *
 * @param {string} [string=''] - The string to wrap.
 * @returns {string} The double quote wrapped string.
 */
const quote = function quote(string = EMPTY_STRING) {
  return JSON.stringify(String(string));
};

module.exports.quote = quote;

/**
 * Supply a new line if required.
 *
 * @param {boolean} [generate=true] - Generate if true.
 * @returns {string} A newline or an empty string.
 */
const newLine = function newLine(generate = true) {
  return generate ? NEW_LINE : EMPTY_STRING;
};

module.exports.newLine = newLine;

/**
 * Supply the pre-log string if required.
 *
 * @param {boolean} [generate=true] - Generate if true.
 * @returns {string} A pre-log string or an empty string.
 */
const preLog = function preLog(generate = true) {
  return generate ? PRE_LOG + SPACE_STRING : EMPTY_STRING;
};

module.exports.preLog = preLog;

/**
 * Supply the ellipses string if required.
 *
 * @param {boolean} [generate=true] - Generate if true.
 * @returns {string} An ellipses string or an empty string.
 */
const ellipses = function ellipses(generate = true) {
  return generate ? EMPTY_STRING : SPACE_STRING + ELLIPSES + SPACE_STRING;
};

module.exports.ellipses = ellipses;

/**
 * Create a message string for stdout or stderr.
 *
 * @param {*} message - The message to be formatted.
 * @param {boolean} [newline=true] - Whether to append a newline.
 * @returns {string} The formatted message.
 */
const createMessage = function createMessage(message, newline = true) {
  const leading = preLog(typeof message === 'string' && Boolean(message));
  const msg = isString(message) ? String(message) : inspect(message);
  const trailing = `${ellipses(newline)}${newLine(newline)}`;

  return `${leading}${msg}${trailing}`;
};

module.exports.createMessage = createMessage;

/**
 * Write a message to an output stream.
 *
 * @param {string} name - The output stream.
 * @param {*} message - The message to write.
 * @param {boolean} [newline=true] - Whether to append a newline.
 */
const write = function write(name, message, newline) {
  return getBooleanOption(process, `${name}.writable`) && process[name].write(createMessage(message, newline));
};

/**
 * Write a message to stdout.
 *
 * @param {*} message - The message to write.
 * @param {boolean} [newline=true] - Whether to append a newline.
 */
const stdout = function stdout(message, newline = true) {
  return write('stdout', message, newline);
};

module.exports.stdout = stdout;

/**
 * Write a message to stderr.
 *
 * @param {*} message - The message to write.
 * @param {boolean} [newline=true] - Whether to append a newline.
 */
const stderr = function stderr(message, newline = true) {
  return write('stderr', message, newline);
};

module.exports.stderr = stderr;

/**
 * Write a new line to stdout.
 */
const stdNewLine = function stdNewLine() {
  return stdout(EMPTY_STRING);
};

module.exports.stdNewLine = stdNewLine;

/**
 * Write a new line to stderr.
 */
const stderrNewLine = function stderrNewLine() {
  return stderr(EMPTY_STRING);
};

module.exports.stderrNewLine = stderrNewLine;

/**
 * Write "Done." to stdout.
 */
const stdDone = function stdDone() {
  return stdout(DONE_MSG);
};

module.exports.stdDone = stdDone;

/**
 * Write "Failed." to stderr.
 */
const stdFailed = function stdFailed() {
  return stderr(FAILED_MSG);
};

module.exports.stdFailed = stdFailed;

/**
 * Create a native notification.
 *
 * @param {object} [options={}] - The options.
 */
const notify = function notify(options = {}) {
  const opts = Object(options);
  const {message, title, icon} = opts;

  notifier.notify({
    ...opts,
    icon: ICONS[icon] || (typeof icon === 'string' ? icon : 'Terminal Icon'),
    message: truncate(isString(message) ? String(message) : JSON.stringify(message, null, 2), {length: 256}),
    title: truncate(typeof title === 'string' ? String(title) : EMPTY_STRING, {length: 32}),
  });
};

module.exports.notify = notify;

/**
 * Like mkdir -p, but in node.js!
 *
 * @param {string} source - The name of the directory to be created.
 * @param {object} [options={}] - The options.
 * @returns {Promise} A promise.
 */
const mkdir = function mkdir(source, options = {}) {
  stdout(`Creating directory: ${quote(source)}`, false);

  return promiseMkdirp(source)
    .then(stdDone)
    .catch((error) => {
      if (error.code !== 'EEXIST') {
        stdFailed();
        stderr(error);

        if (getBooleanOption(options, 'notify', true)) {
          notify({
            title: getStringOption(options, 'title'),
            message: 'Failed to create directory',
            icon: ERROR,
          });
        }

        throw error;
      }
    });
};

module.exports.mkdir = mkdir;

/**
 * Like rm -rf, but in node.js!
 *
 * @param {string} source - Globbing pattern for files.
 * @param {object} [options={}] - The options.
 * @returns {Promise} A promise.
 */
const remove = function remove(source, options = {}) {
  stdout(`Deleting: ${quote(source)}`, false);

  return promiseRimraf(source)
    .then(stdDone)
    .catch((error) => {
      stdFailed();
      stderr(error);

      if (getBooleanOption(options, 'notify', true)) {
        notify({
          title: getStringOption(options, 'title'),
          message: 'Failed to delete files',
          icon: ERROR,
        });
      }

      throw error;
    });
};

module.exports.remove = remove;

/**
 * Like cp -r, but in node.js!
 *
 * @param {string} source - The source file or folder.
 * @param {string} destination - The destination file for folder.
 * @param {object} [options={}] - The options.
 * @returns {Promise} A promise.
 */
const copy = function copy(source, destination, options = {}) {
  stdout(`Copying directory: ${quote(source)}`, false);

  return promiseNcp(source, destination)
    .then(stdDone)
    .catch((error) => {
      stdFailed();
      stderr(error);

      if (getBooleanOption(options, 'notify', true)) {
        notify({
          title: getStringOption(options, 'title'),
          message: 'Copy failed',
          icon: ERROR,
        });
      }

      throw error;
    });
};

module.exports.copy = copy;

/**
 *
 * @param {string} command - The command.
 * @param {Array.<string>} args - The command arguments.
 * @param {object} [options={}] - The options.
 * @returns {Promise} A promise of the values from execution.
 */
const spawn = function spawn(command, args, options = {}) {
  const cmd = String(command);
  const argsArray = Object.freeze(castArray(args).map(String));
  const collect = getBooleanOption(options, 'collect', true);
  const print = getBooleanOption(options, 'print', true);
  const charset = getStringOption(options, 'charset', 'utf8');
  const start = toInteger(getNumberOption(options, 'start', 0));
  const end = toInteger(getNumberOption(options, 'end', buffer.constants.MAX_STRING_LENGTH));

  return new Promise((resolve, reject) => {
    try {
      const proc = childProcess.spawn(cmd, argsArray, options);
      const stdOut = [];
      const stdErr = [];
      const result = {
        code: null,
        error: null,
        stderr: null,
        stdout: null,
      };

      if (getBooleanOption(proc, 'stdout.readable')) {
        proc.stdout.on('data', (data) => {
          if (collect) {
            stdOut.push(data);
          }

          if (print && getBooleanOption(process, 'stdout.writable')) {
            const st = clamp(start, 0, data.length);
            const en = clamp(end, 0, data.length);

            // noinspection JSCheckFunctionSignatures
            process.stdout.write(data.toString(charset, st, en));
          }
        });
      }

      if (getBooleanOption(proc, 'stderr.readable')) {
        proc.stderr.on('data', (data) => {
          if (collect) {
            stdErr.push(data);
          }

          if (print && getBooleanOption(process, 'stderr.writable')) {
            const st = clamp(start, 0, data.length);
            const en = clamp(end, 0, data.length);

            // noinspection JSCheckFunctionSignatures
            process.stderr.write(data.toString(charset, st, en));
          }
        });
      }

      proc.on('close', (code) => {
        result.code = code;

        if (collect) {
          result.stdout = Buffer.concat(stdOut);
          result.stderr = Buffer.concat(stdErr);
        }

        resolve(result);
      });

      proc.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.spawn = spawn;
