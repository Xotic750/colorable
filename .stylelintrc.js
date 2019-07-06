/**
 * @file Manages the root configuration settings for project wide stylelint.
 * @module stylelint/root/configuration
 * @version 1.0.0
 * @see {@link https://stylelint.io/} for further information.
 */

module.exports = {
  /**
   * Extend an existing configuration.
   * @type {string|Array.<string>}
   * @see {@link https://github.com/stylelint/stylelint/blob/master/docs/user-guide/configuration.md#extends}
   */
  extends: [
    /**
     * The standard shareable config for stylelint.
     * @type {string}
     * @see {@link https://github.com/stylelint/stylelint-config-standard}
     */
    'stylelint-config-standard',
    /**
     * Turns off all rules that are unnecessary or might conflict with prettier.
     * @type {string}
     * @see {@link https://github.com/shannonmoeller/stylelint-config-prettier}
     */
    'stylelint-config-prettier',
  ],

  /**
   * @type {Array.<string>}
   */
  plugins: [
    'stylelint-prettier',
    'stylelint-no-unsupported-browser-features',
    'stylelint-declaration-strict-value',
  ],

  /**
   * @type {Array.<string>}
   */
  processors: [], // do not include empty

  /**
   * @type {!Object}
   */
  rules: {
    'no-empty-source': null,
    'no-missing-end-of-source-newline': null, // currently has a bug #3428
    'prettier/prettier': null,
    'plugin/no-unsupported-browser-features': [true, {
      severity: 'warning',
    }],
    'scale-unlimited/declaration-strict-value': ['color', {
      ignoreKeywords: 'inherit',
    }],
  },
};
