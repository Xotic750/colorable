import Color from '@xotic750/color';
import create from 'object-create-x';
import objectKeys from 'object-keys-x';
import defineProperties, {defineProperty} from 'object-define-properties-x';
import map from 'array-map-x';
import forEach from 'array-for-each-x';
import reduce from 'array-reduce-x';
import bind from 'bind-x';
import assign from 'object-assign-x';
import uniq from 'array-uniq-x';
import isArray from 'is-array-x';
import freeze from 'object-freeze-x';

const push = bind(bind.call, [].push);
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
export const minimums = freeze({
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
const minimumsKeys = freeze(objectKeys(minimums));

/**
 * BaseColor object.
 *
 * @class
 * @type {object}
 * @property {ReadonlyArray<Combination|object>} combinations - Combinations that matched threshold.
 * @property {string} hexColor - The hex color.
 * @property {string} [name] - The name of the color.
 */
export const BaseColor = function BaseColor(options) {
  const {model, name, value} = options;
  Color.call(this, value, model);

  defineProperty(this, 'hexColor', {
    enumerable: true,
    value: new Color(this).hex(),
  });

  if (name) {
    defineProperty(this, NAME, {
      enumerable: true,
      value: name,
    });
  }
};

objectKeys(Color).forEach(function iteratee(key) {
  defineProperty(BaseColor, key, {
    configurable: true,
    enumerable: true,
    value: Color[key],
  });
});

BaseColor.prototype = create(Color.prototype, {
  constructor: {
    value: BaseColor,
  },
});

/**
 * Colorable object.
 *
 * @class
 * @type {object}
 * @property {ReadonlyArray<Combination|object>} combinations - Combinations that matched threshold.
 * @property {string} hexColor - The hex color.
 * @property {string} [name] - The name of the color.
 */
export const Colorable = function Colorable(options) {
  BaseColor.call(this, options);

  defineProperty(this, 'combinations', {
    configurable: true,
    enumerable: true,
    value: [],
  });
};

objectKeys(BaseColor).forEach(function iteratee(key) {
  defineProperty(Colorable, key, {
    configurable: true,
    enumerable: true,
    value: BaseColor[key],
  });
});

Colorable.prototype = create(BaseColor.prototype, {
  constructor: {
    value: Colorable,
  },

  /**
   * Give a compact representation.
   *
   * @function compact
   * @returns {{hexColor: string, combinations: Array<{contrastRatio: number, hexColor: string, accessibility: Accessibility}>}} - Compact representation.
   */
  compact: {
    configurable: true,
    value: function compact() {
      const value = {
        combinations: map(this.combinations, function iteratee(combination) {
          return combination.compact();
        }),
        hexColor: this.hexColor,
      };

      if (this.name) {
        value.name = this.name;
      }

      return value;
    },
  },
});

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
export const Combination = function Combination(color, options) {
  BaseColor.call(this, options);

  const contrastRatio = new Color(color).contrast(new Color(this));
  const iteratee = function iteratee(minimum, key) {
    minimum[key] = contrastRatio >= minimums[key];

    return minimum;
  };

  defineProperties(this, {
    accessibility: {enumerable: true, value: freeze(reduce(minimumsKeys, iteratee, {}))},
    contrastRatio: {enumerable: true, value: contrastRatio},
  });
};

objectKeys(BaseColor).forEach(function iteratee(key) {
  defineProperty(Combination, key, {
    configurable: true,
    enumerable: true,
    value: BaseColor[key],
  });
});

Combination.prototype = create(BaseColor.prototype, {
  constructor: {
    value: Combination,
  },

  /**
   * Give a compact representation.
   *
   * @function compact
   * @returns {{contrastRatio: number, hexColor: string, accessibility: Accessibility}} - Compact representation.
   */
  compact: {
    value: function compact() {
      /** @type {Accessibility} */
      const accessibility = assign({}, this.accessibility);
      const value = {
        accessibility,
        contrastRatio: this.contrastRatio,
        hexColor: this.hexColor,
      };

      if (this.name) {
        value.name = this.name;
      }

      return value;
    },
  },
});

/**
 * Merge the default and user options.
 *
 * @param {object} options - The user option object.
 * @returns {Readonly} - The options object.
 */
const getOptions = function getOptions(options) {
  return assign({compact: false, threshold: 0, uniq: true}, options);
};

/**
 * Creates a shallow copy of the original array or an array of unique values.
 *
 * @param {Array} array - The array of values.
 * @param {boolean} unique - Whether the returned array should be unique.
 * @returns {Array<any>} - An array of values.
 */
const getIterationArray = function getIterationArray(array, unique) {
  return unique ? uniq(array) : array;
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
  if (isArray(colors)) {
    const iteratee = function iteratee(value) {
      return {value};
    };

    return map(getIterationArray(colors, unique), iteratee);
  }

  if (colors && typeof colors === 'object') {
    const iteratee = function iteratee(key) {
      return {name: key, value: colors[key]};
    };

    return map(getIterationArray(objectKeys(colors), unique), iteratee);
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

  return freeze(
    map(colorsArray, function iterateeOuter(textColor) {
      const color = new Colorable(textColor);

      forEach(colorsArray, function iterateeInner(backgroundColor) {
        if (textColor === backgroundColor) {
          return;
        }

        const combination = new Combination(color, backgroundColor);

        if (combination.contrastRatio > opts.threshold) {
          push(color.combinations, combination);
        }
      });

      freeze(color.combinations);

      return opts.compact ? color.compact() : color;
    }),
  );
}
