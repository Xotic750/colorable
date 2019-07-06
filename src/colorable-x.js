import assign from 'lodash/assign';
import cloneDeep from 'lodash/cloneDeep';
import uniq from 'lodash/uniq';
import Color from 'color';

/**
 * Colorable object.
 *
 * @param {object} props - The name of the color object.
 * @param {number|string|object} colorDefinition - The color definition.
 * @param {string} [model] - The model type.
 * @class
 */
export const Colorable = function Colorable(props, colorDefinition, model) {
  assign(this, props);
  Color.call(this, colorDefinition, model);
};

Colorable.prototype = Object.create(Color.prototype);

Object.defineProperties(Colorable.prototype, {
  constructor: {
    value: Colorable,
    writable: true,
  },
});

/**
 * The minimum values for WCAG rating.
 *
 * @type {Readonly}
 */
export const minimums = Object.freeze({
  aa: 4.5,
  aaLarge: 3,
  aaa: 7,
  aaaLarge: 4.5,
});

/**
 * WCAG rating keys.
 *
 * @type {ReadonlyArray<string>}
 */
const minimumsKeys = Object.freeze(Object.keys(minimums));

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
        threshold: 0,
        compact: false,
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
      const textColorObject = new Color(textColor.value);
      const textProps = {
        combinations: [],
        hex: textColorObject.hex(),
      };

      if (textColor.name) {
        textProps.name = textColor.name;
      }

      if (opts.compact) {
        textProps.hex = textColorObject.hex();
      }

      colorsArray.forEach((backgroundColor) => {
        if (textColor === backgroundColor) {
          return;
        }

        const backgroundColorObject = new Color(backgroundColor.value);
        const backgroundProps = {
          contrast: textColorObject.contrast(backgroundColorObject),
        };

        if (backgroundColor.name) {
          backgroundProps.name = backgroundColor.name;
        }

        if (opts.compact) {
          backgroundProps.hex = backgroundColorObject.hex();
        }

        backgroundProps.accessibility = Object.freeze(
          minimumsKeys.reduce((minimum, key) => {
            minimum[key] = backgroundProps.contrast >= minimums[key];

            return minimum;
          }, {}),
        );

        Object.freeze(backgroundProps);

        if (backgroundProps.contrast > opts.threshold) {
          const combination = opts.compact ? backgroundProps : new Colorable(backgroundProps, backgroundColorObject);

          textProps.combinations.push(combination);
        }
      });

      Object.freeze(textProps.combinations);
      Object.freeze(textProps);

      return opts.compact ? textProps : new Colorable(textProps, textColorObject);
    }),
  );
}
