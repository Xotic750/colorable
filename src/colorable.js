import assign from 'lodash/assign';
import cloneDeep from 'lodash/cloneDeep';
import uniq from 'lodash/uniq';
import Color from '@xotic750/color';

const NAME = 'name';

/**
 * Constructor options.
 *
 * @typedef {object} ConstructorOptions
 * @property {string} [model] - Color model.
 * @property {string} [name] - The name of the color.
 * @property {*} value - Color value.
 */

/**
 * The minimum values for WCAG rating.
 *
 * @type {Readonly}
 * @property {number} aa - AA minimum value.
 * @property {number} aaa - AAA minimum value.
 * @property {number} aaaLarge - AAA Large minimum value.
 * @property {number} aaLarge - AA Large minimum value.
 */
export const minimums = Object.freeze({
  aa: 4.5,
  aaa: 7,
  aaaLarge: 4.5,
  aaLarge: 3,
});

/**
 * An object of pass and fail results for accessibility.
 *
 * @typedef {object} Accessibility
 * @property {boolean} aa - AA pass or fail.
 * @property {boolean} aaa - AAA pass or fail.
 * @property {boolean} aaaLarge - AAA Large pass or fail.
 * @property {boolean} aaLarge - AA Large pass or fail.
 */
/**
 * WCAG rating keys.
 *
 * @type {ReadonlyArray<string>}
 */
const minimumsKeys = Object.freeze(Object.keys(minimums));

/**
 * Colorable object.
 *
 * @class
 * @type {object}
 * @property {ReadonlyArray<Combination|object>} combinations - Combinations that matched threshold
 * @property {string} hexColor - The hex color.
 * @property {string} [name] - The name of the color.
 */
export class Colorable extends Color {
  /**
   * @param {ConstructorOptions} options -
   */
  constructor(options) {
    const {model, name, value} = options;
    super(value, model);

    Object.defineProperties(this, {
      combinations: {
        enumerable: true,
        value: [],
      },
      hexColor: {
        enumerable: true,
        value: this.hex(),
      },
    });

    if (name) {
      Object.defineProperty(this, NAME, {
        enumerable: true,
        value: name,
      });
    }
  }

  /**
   * Give a compact representation.
   *
   * @returns {{hexColor: string, combinations: Array<{contrastRatio: number, hexColor: string, accessibility: Accessibility}>}} - Compact representation.
   */
  compact() {
    const value = {
      combinations: this.combinations.map((combination) => combination.compact()),
      hexColor: this.hexColor,
    };

    if (this.name) {
      value.name = this.name;
    }

    return value;
  }
}

/**
 * Combination object.
 *
 * @class
 * @type {object}
 * @property {Readonly<number>} accessibility - Accessibility scores.
 * @property {number} contrastRatio - The contrast ratio.
 * @property {string} hexColor - The hex color.
 * @property {string} [name] - The name of the color.
 */
export class Combination extends Color {
  /**
   * @param {Colorable} color -
   * @param {ConstructorOptions} options -
   */
  constructor(color, options) {
    const {model, name, value} = options;
    super(value, model);

    const contrastRatio = color.contrast(this);
    Object.defineProperties(this, {
      accessibility: {
        enumerable: true,
        value: Object.freeze(
          minimumsKeys.reduce((minimum, key) => {
            minimum[key] = contrastRatio >= minimums[key];

            return minimum;
          }, {}),
        ),
      },
      contrastRatio: {
        enumerable: true,
        value: contrastRatio,
      },
      hexColor: {
        enumerable: true,
        value: this.hex(),
      },
    });

    if (name) {
      Object.defineProperty(this, NAME, {
        enumerable: true,
        value: name,
      });
    }
  }

  /**
   * Give a compact representation.
   *
   * @returns {{contrastRatio: number, hexColor: string, accessibility: Accessibility}} - Compact representation.
   */
  compact() {
    /** @type {Accessibility} */
    const accessibility = {...this.accessibility};
    const value = {
      accessibility,
      contrastRatio: this.contrastRatio,
      hexColor: this.hexColor,
    };

    if (this.name) {
      value.name = this.name;
    }

    return value;
  }
}

/**
 * Merge the default and user options.
 *
 * @param {object} options - The user option object.
 * @returns {Readonly} - The options object.
 */
const getOptions = function getOptions(options) {
  return Object.freeze(
    assign(
      {
        compact: false,
        threshold: 0,
        uniq: true,
      },
      options,
    ),
  );
};

/**
 * Creates a shallow copy of the original array or an array of unique values.
 *
 * @param {Array} array - The array of values.
 * @param {boolean} unique - Whether the returned array should be unique.
 * @returns {ReadonlyArray<any>} - An array of values.
 */
const getIterationArray = function getIterationArray(array, unique) {
  return Object.freeze(cloneDeep(unique ? uniq(array) : array));
};

/**
 * Creates an array of color objects from the provided definitions.
 *
 * @param {Array<string>|object} colors - The color definitions.
 * @param {boolean} unique - Whether the results should be unique.
 * @returns {ReadonlyArray<Readonly<{name: any, value: *}>>} - An array of objects.
 * @throws {TypeError} - If definition is not an array or object.
 */
const getColors = function getColors(colors, unique) {
  if (Array.isArray(colors)) {
    return Object.freeze(getIterationArray(colors, unique).map((value) => Object.freeze({value})));
  }

  if (colors && typeof colors === 'object') {
    return Object.freeze(
      getIterationArray(Object.keys(colors), unique).map((key) => Object.freeze({name: key, value: colors[key]})),
    );
  }

  throw new TypeError('Must provide an array or object');
};

/**
 * Colorable combination contrast tester.
 *
 * @param {Array|object} [colors] - The color definitions.
 * @param {object} [options] - User options.
 * @returns {ReadonlyArray<Readonly>} - An array objects in colorable format.
 */
export default function colorable(colors, options) {
  const opts = getOptions(options);
  const colorsArray = getColors(colors, opts.uniq);

  return Object.freeze(
    colorsArray.map((textColor) => {
      const color = new Colorable(textColor);

      colorsArray.forEach((backgroundColor) => {
        if (textColor === backgroundColor) {
          return;
        }

        const combination = new Combination(color, backgroundColor);

        if (combination.contrastRatio > opts.threshold) {
          color.combinations.push(combination);
        }
      });

      Object.freeze(color.combinations);

      return opts.compact ? color.compact() : color;
    }),
  );
}
