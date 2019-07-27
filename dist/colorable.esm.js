function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import assign from 'lodash/assign';
import cloneDeep from 'lodash/cloneDeep';
import uniq from 'lodash/uniq';
import Color from '@xotic750/color';
var NAME = 'name';
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

export var minimums = Object.freeze({
  aa: 4.5,
  aaa: 7,
  aaaLarge: 4.5,
  aaLarge: 3
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

var minimumsKeys = Object.freeze(Object.keys(minimums));
/**
 * BaseColor object.
 *
 * @class
 * @type {object}
 * @property {ReadonlyArray<Combination|object>} combinations - Combinations that matched threshold.
 * @property {string} hexColor - The hex color.
 * @property {string} [name] - The name of the color.
 */

export var BaseColor =
/*#__PURE__*/
function (_Color) {
  _inherits(BaseColor, _Color);

  /**
   * @param {ConstructorOptions} options -
   */
  function BaseColor(options) {
    var _this;

    _classCallCheck(this, BaseColor);

    var model = options.model,
        name = options.name,
        value = options.value;
    _this = _possibleConstructorReturn(this, _getPrototypeOf(BaseColor).call(this, value, model));
    Object.defineProperty(_assertThisInitialized(_this), 'hexColor', {
      enumerable: true,
      value: _this.hex()
    });

    if (name) {
      Object.defineProperty(_assertThisInitialized(_this), NAME, {
        enumerable: true,
        value: name
      });
    }

    return _this;
  }

  return BaseColor;
}(Color);
/**
 * Colorable object.
 *
 * @class
 * @type {object}
 * @property {ReadonlyArray<Combination|object>} combinations - Combinations that matched threshold.
 * @property {string} hexColor - The hex color.
 * @property {string} [name] - The name of the color.
 */

export var Colorable =
/*#__PURE__*/
function (_BaseColor) {
  _inherits(Colorable, _BaseColor);

  /**
   * @param {ConstructorOptions} options -
   */
  function Colorable(options) {
    var _this2;

    _classCallCheck(this, Colorable);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Colorable).call(this, options));
    Object.defineProperty(_assertThisInitialized(_this2), 'combinations', {
      enumerable: true,
      value: []
    });
    return _this2;
  }
  /**
   * Give a compact representation.
   *
   * @returns {{hexColor: string, combinations: Array<{contrastRatio: number, hexColor: string, accessibility: Accessibility}>}} - Compact representation.
   */


  _createClass(Colorable, [{
    key: "compact",
    value: function compact() {
      var _this3 = this;

      var value = {
        combinations: this.combinations.map(function (combination) {
          _newArrowCheck(this, _this3);

          return combination.compact();
        }.bind(this)),
        hexColor: this.hexColor
      };

      if (this.name) {
        value.name = this.name;
      }

      return value;
    }
  }]);

  return Colorable;
}(BaseColor);
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

export var Combination =
/*#__PURE__*/
function (_BaseColor2) {
  _inherits(Combination, _BaseColor2);

  /**
   * @param {Colorable} color -
   * @param {ConstructorOptions} options -
   */
  function Combination(color, options) {
    var _this5 = this;

    var _this4;

    _classCallCheck(this, Combination);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(Combination).call(this, options));
    var contrastRatio = color.contrast(_assertThisInitialized(_this4));
    Object.defineProperties(_assertThisInitialized(_this4), {
      accessibility: {
        enumerable: true,
        value: Object.freeze(minimumsKeys.reduce(function (minimum, key) {
          _newArrowCheck(this, _this5);

          minimum[key] = contrastRatio >= minimums[key];
          return minimum;
        }.bind(this), {}))
      },
      contrastRatio: {
        enumerable: true,
        value: contrastRatio
      }
    });
    return _this4;
  }
  /**
   * Give a compact representation.
   *
   * @returns {{contrastRatio: number, hexColor: string, accessibility: Accessibility}} - Compact representation.
   */


  _createClass(Combination, [{
    key: "compact",
    value: function compact() {
      /** @type {Accessibility} */
      var accessibility = _objectSpread({}, this.accessibility);

      var value = {
        accessibility: accessibility,
        contrastRatio: this.contrastRatio,
        hexColor: this.hexColor
      };

      if (this.name) {
        value.name = this.name;
      }

      return value;
    }
  }]);

  return Combination;
}(BaseColor);
/**
 * Merge the default and user options.
 *
 * @param {object} options - The user option object.
 * @returns {Readonly} - The options object.
 */

var getOptions = function getOptions(options) {
  return Object.freeze(assign({
    compact: false,
    threshold: 0,
    uniq: true
  }, options));
};
/**
 * Creates a shallow copy of the original array or an array of unique values.
 *
 * @param {Array} array - The array of values.
 * @param {boolean} unique - Whether the returned array should be unique.
 * @returns {ReadonlyArray<any>} - An array of values.
 */


var getIterationArray = function getIterationArray(array, unique) {
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


var getColors = function getColors(colors, unique) {
  var _this6 = this;

  if (Array.isArray(colors)) {
    return Object.freeze(getIterationArray(colors, unique).map(function (value) {
      _newArrowCheck(this, _this6);

      return Object.freeze({
        value: value
      });
    }.bind(this)));
  }

  if (colors && _typeof(colors) === 'object') {
    return Object.freeze(getIterationArray(Object.keys(colors), unique).map(function (key) {
      _newArrowCheck(this, _this6);

      return Object.freeze({
        name: key,
        value: colors[key]
      });
    }.bind(this)));
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
  var _this7 = this;

  var opts = getOptions(options);
  var colorsArray = getColors(colors, opts.uniq);
  return Object.freeze(colorsArray.map(function (textColor) {
    var _this8 = this;

    _newArrowCheck(this, _this7);

    var color = new Colorable(textColor);
    colorsArray.forEach(function (backgroundColor) {
      _newArrowCheck(this, _this8);

      if (textColor === backgroundColor) {
        return;
      }

      var combination = new Combination(color, backgroundColor);

      if (combination.contrastRatio > opts.threshold) {
        color.combinations.push(combination);
      }
    }.bind(this));
    Object.freeze(color.combinations);
    return opts.compact ? color.compact() : color;
  }.bind(this)));
}

//# sourceMappingURL=colorable.esm.js.map