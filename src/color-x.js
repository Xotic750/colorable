import colorString from 'color-string';
import convert from 'color-convert';
import clamp from 'lodash/clamp';
import slice from 'lodash/slice';
import round from 'lodash/round';
import castArray from 'lodash/castArray';
import has from 'lodash/has';
import isNil from 'lodash/isNil';
import toInteger from 'lodash/toInteger';
import isCountingNumber from 'Global/Assets/isCountingNumber';

const EMPTY_STRING = '';
const ALPHA = 'alpha';
const RGB = 'rgb';
const HSL = 'hsl';
const HSV = 'hsv';
const HWB = 'hwb';
const HCG = 'hcg';
const XYZ = 'xyz';
const LAB = 'lab';
const CMYK = 'cmyk';
const AA = 'AA';
const AAA = 'AAA';
/** @type {ReadonlyArray<string>} */
const rgbKeys = Object.freeze(RGB.split(EMPTY_STRING));
/** @type {ReadonlyArray<string>} */
const skippedModels = Object.freeze([
  /* to be honest, I don't really feel like keyword belongs in color convert, but eh. */
  'keyword',

  /* gray conflicts with some method names, and has its own method defined. */
  'gray',

  /* shouldn't really be in color-convert either... */
  'hex',
]);

/** @type {Readonly<string>} */
const hashedModelKeys = Object.freeze(
  Object.keys(convert).reduce((hashed, model) => {
    const prop = slice(convert[model].labels)
      .sort()
      .join(EMPTY_STRING);

    hashed[prop] = model;

    return hashed;
  }, Object.create(null)),
);

/**
 * Create a bound function that rounds to x places.
 *
 * @param {number} places - The number of places to round to.
 * @returns {function({value: number}): number} - The bound rounding function.
 */
const roundToPlaces = function roundToPlaces(places) {
  return function boundRoundToPlaces(value) {
    return round(value, places);
  };
};

/**
 * Create a bound function that clamps the value to between 0 and max inclusive.
 *
 * @param {number} max - The maximum value.
 * @returns {function({value: number}): number} - The bound clamp function.
 */
const maxfn = function maxfn(max) {
  return function boundMaxfn(value) {
    return clamp(value, 0, max);
  };
};

/**
 * Partially zeros an array to a specified length.
 *
 * @param {Array} array - The array to be partially zeroed.
 * @param {number} [length=0] - The length to zero to.
 * @returns {Array<*>} - The partially zeroed array.
 */
const zeroArray = function zeroArray(array, length = 0) {
  for (let index = 0; index < length; index += 1) {
    if (typeof array[index] !== 'number') {
      array[index] = 0;
    }
  }

  return array;
};

/**
 * Test if a value is a possible model.
 *
 * @param {*} value - The value to test.
 * @returns {boolean} - Indicates if value is a possible model.
 */
const isModel = function isModel(value) {
  return typeof value === 'string' && Boolean(value.trim());
};

/**
 * Convert value to appropriate number for rounding places.
 *
 * @param {*} value - The value to convert.
 * @returns {number} - The number of places.
 */
const getPlaces = function getPlaces(value) {
  return typeof value === 'number' ? toInteger(value) : 1;
};

/**
 * Convert a color object to an array.
 *
 * @param {Color} colorObject - The color object.
 * @returns {Array<number>} - The array from the color object.
 */
const getColorArray = function getColorArray(colorObject) {
  const {color, valpha} = colorObject;

  // noinspection JSIncompatibleTypesComparison
  return valpha === 1 ? color : [...color, valpha];
};

const limiters = Object.create(null);

/**
 * The Color class.
 *
 * @class Color
 * @type {object}
 * @property {Array<number>} color - The color represented in the model array.
 * @property {string} model - The color model.
 * @property {number} valpha - The alpha value of the color.
 */
export default class Color {
  constructor(...args) {
    let [obj, model] = args;

    if (isModel(model)) {
      if (skippedModels.includes(model)) {
        model = null;
      }

      if (!has(convert, model)) {
        throw new Error(`Unknown model: ${model}`);
      }
    }

    if (isNil(obj)) {
      this.model = RGB;
      this.color = [0, 0, 0];
      this.valpha = 1;
    } else if (obj instanceof Color) {
      this.model = obj.model;
      this.color = [...obj.color];
      this.valpha = obj.valpha;
    } else if (typeof obj === 'string') {
      const result = colorString.get(obj);

      if (result === null) {
        throw new Error(`Unable to parse color from string: ${obj}`);
      }

      this.model = result.model;
      const {channels} = convert[this.model];
      this.color = result.value.slice(0, channels);
      this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
    } else if (isCountingNumber(obj.length)) {
      this.model = model || RGB;
      const {channels} = convert[this.model];
      const newArr = slice(obj, 0, channels);
      this.color = zeroArray(newArr, channels);
      this.valpha = typeof obj[channels] === 'number' ? obj[channels] : 1;
    } else if (typeof obj === 'number') {
      /* this is always RGB - can be converted later on. */
      /* eslint-disable-next-line no-bitwise */
      obj &= 0xffffff;
      this.model = RGB;
      /* eslint-disable-next-line no-bitwise */
      this.color = [(obj >> 16) & 0xff, (obj >> 8) & 0xff, obj & 0xff];
      this.valpha = 1;
    } else {
      this.valpha = 1;

      const keys = Object.keys(obj);

      if (has(obj, ALPHA)) {
        keys.splice(keys.indexOf(ALPHA), 1);
        this.valpha = typeof obj.alpha === 'number' ? obj.alpha : 0;
      }

      const hashedKeys = keys.sort().join(EMPTY_STRING);

      if (!has(hashedModelKeys, hashedKeys)) {
        throw new Error(`Unable to parse color from object: ${JSON.stringify(obj)}`);
      }

      this.model = hashedModelKeys[hashedKeys];

      const color = convert[this.model].labels.split(EMPTY_STRING).map((label) => obj[label]);

      this.color = zeroArray(color);
    }

    /* perform limitations (clamping, etc.) */
    if (limiters[this.model]) {
      const {channels} = convert[this.model];

      for (let i = 0; i < channels; i += 1) {
        const limit = limiters[this.model][i];

        if (limit) {
          this.color[i] = limit(this.color[i]);
        }
      }
    }

    this.valpha = clamp(this.valpha, 0, 1);

    Object.freeze(this.color);
    Object.defineProperties(this, {
      color: {
        configurable: false,
        enumerable: true,
        writable: false,
      },
      model: {
        configurable: false,
        enumerable: true,
        writable: false,
      },
      valpha: {
        configurable: false,
        enumerable: true,
        writable: false,
      },
    });
  }

  toString() {
    return this.string();
  }

  // toJSON() {
  //   return this[this.model]();
  // }

  string(places) {
    const colorObject = (has(colorString.to, this.model) ? this : this.rgb()).round(getPlaces(places));
    const args = getColorArray(colorObject);

    return colorString.to[colorObject.model](args);
  }

  percentString(places) {
    const colorObject = this.rgb().round(getPlaces(places));
    const args = getColorArray(colorObject);

    return colorString.to.rgb.percent(args);
  }

  array() {
    return getColorArray(this);
  }

  object() {
    const result = {};
    const {channels, labels} = convert[this.model];

    for (let i = 0; i < channels; i += 1) {
      result[labels[i]] = this.color[i];
    }

    if (this.valpha !== 1) {
      result.alpha = this.valpha;
    }

    return result;
  }

  unitArray() {
    const rgb = this.rgb().color.map((value) => value / 255);

    if (this.valpha !== 1) {
      rgb.push(this.valpha);
    }

    return rgb;
  }

  unitObject() {
    const rgb = rgbKeys.reduce((object, key) => {
      object[key] /= 255;

      return object;
    }, this.rgb().object());

    if (this.valpha !== 1) {
      rgb.alpha = this.valpha;
    }

    return rgb;
  }

  round(places) {
    const placesMax = Math.max(toInteger(places) || 0, 0);

    return new Color([...this.color.map(roundToPlaces(placesMax)), this.valpha], this.model);
  }

  alpha(val) {
    if (arguments.length) {
      return new Color([...this.color, clamp(val, 0, 1)], this.model);
    }

    return this.valpha;
  }

  keyword(val) {
    if (arguments.length) {
      return new Color(val);
    }

    return convert[this.model].keyword(this.color);
  }

  hex(val) {
    if (arguments.length) {
      return new Color(val);
    }

    return colorString.to.hex(this.rgb().round().color);
  }

  rgbNumber() {
    const rgb = this.rgb().color;

    /* eslint-disable-next-line no-bitwise */
    return ((rgb[0] & 0xff) << 16) | ((rgb[1] & 0xff) << 8) | (rgb[2] & 0xff);
  }

  luminosity() {
    /** @see {http://www.w3.org/TR/WCAG20/#relativeluminancedef} */
    const rgb = this.rgb().color;
    const lum = rgb.map((channel) => {
      const chan = channel / 255;

      return chan <= 0.03928 ? chan / 12.92 : ((chan + 0.055) / 1.055) ** 2.4;
    });

    return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
  }

  contrast(color2) {
    /** @see {http://www.w3.org/TR/WCAG20/#contrast-ratiodef} */
    const lum1 = this.luminosity();
    const lum2 = color2.luminosity();

    if (lum1 > lum2) {
      return (lum1 + 0.05) / (lum2 + 0.05);
    }

    return (lum2 + 0.05) / (lum1 + 0.05);
  }

  level(color2) {
    const contrastRatio = this.contrast(color2);

    if (contrastRatio >= 7.1) {
      return AAA;
    }

    return contrastRatio >= 4.5 ? AA : EMPTY_STRING;
  }

  isDark() {
    const rgb = this.rgb().color;
    /**
     * YIQ equation.
     *
     * @see {http://24ways.org/2010/calculating-color-contrast}
     */
    const yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;

    return yiq < 128;
  }

  isLight() {
    return !this.isDark();
  }

  negate() {
    const rgb = rgbKeys.reduce((object, key) => {
      object[key] = 255 - object[key];

      return object;
    }, this.rgb().object());

    if (this.valpha !== 1) {
      rgb.alpha = this.valpha;
    }

    return new Color(rgb, this.model);
  }

  lighten(ratio) {
    const color = [...this.hsl().color];
    const obj = {
      h: color[0],
      s: color[1],
      l: color[2] + color[2] * ratio,
    };

    if (this.valpha !== 1) {
      obj.alpha = this.valpha;
    }

    return new Color(obj, this.model);
  }

  darken(ratio) {
    const color = [...this.hsl().color];
    const obj = {
      h: color[0],
      s: color[1],
      l: color[2] - color[2] * ratio,
    };

    if (this.valpha !== 1) {
      obj.alpha = this.valpha;
    }

    return new Color(obj, this.model);
  }

  saturate(ratio) {
    const color = [...this.hsl().color];
    const obj = {
      h: color[0],
      s: color[1] + color[1] * ratio,
      l: color[2],
    };

    if (this.valpha !== 1) {
      obj.alpha = this.valpha;
    }

    return new Color(obj, this.model);
  }

  desaturate(ratio) {
    const color = [...this.hsl().color];
    const obj = {
      h: color[0],
      s: color[1] - color[1] * ratio,
      l: color[2],
    };

    if (this.valpha !== 1) {
      obj.alpha = this.valpha;
    }

    return new Color(obj, this.model);
  }

  whiten(ratio) {
    const color = [...this.hwb().color];
    const obj = {
      h: color[0],
      w: color[1] + color[1] * ratio,
      b: color[2],
    };

    if (this.valpha !== 1) {
      obj.alpha = this.valpha;
    }

    return new Color(obj, this.model);
  }

  blacken(ratio) {
    const color = [...this.hwb().color];
    const obj = {
      h: color[0],
      w: color[1],
      b: color[2] + color[2] * ratio,
    };

    if (this.valpha !== 1) {
      obj.alpha = this.valpha;
    }

    return new Color(obj, this.model);
  }

  grayscale() {
    /** @see {http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale} */
    const rgb = this.rgb().color;
    const val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;

    return Color.rgb(val, val, val);
  }

  fade(ratio) {
    return this.alpha(this.valpha - this.valpha * ratio);
  }

  opaquer(ratio) {
    return this.alpha(this.valpha + this.valpha * ratio);
  }

  rotate(degrees) {
    const color = [...this.hsl().color];
    let hue = color[0];
    hue = (hue + degrees) % 360;
    hue = hue < 0 ? 360 + hue : hue;
    color[0] = hue;

    const obj = {
      h: color[0],
      s: color[1],
      l: color[2],
    };

    if (this.valpha !== 1) {
      obj.alpha = this.valpha;
    }

    return new Color(obj, this.model);
  }

  mix(mixinColor, weight) {
    /**
     * Ported from sass implementation in C.
     *
     * @see {https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209}
     */
    if (!mixinColor || !mixinColor.rgb) {
      throw new Error(`Argument to "mix" was not a Color instance, but rather an instance of ${typeof mixinColor}`);
    }

    const color1 = mixinColor.rgb();
    const color2 = this.rgb();
    const p = typeof weight === 'undefined' ? 0.5 : weight;

    const w = 2 * p - 1;
    const a = color1.alpha() - color2.alpha();

    const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
    const w2 = 1 - w1;

    return Color.rgb(
      w1 * color1.red() + w2 * color2.red(),
      w1 * color1.green() + w2 * color2.green(),
      w1 * color1.blue() + w2 * color2.blue(),
      color1.alpha() * p + color2.alpha() * (1 - p),
    );
  }
}

const maxfn100 = maxfn(100);
const maxfn255 = maxfn(255);
const getset = function getset(...args) {
  let [model] = args;
  const [, channel, modifier] = args;

  model = castArray(model);

  model.forEach((m) => {
    if (!Array.isArray(limiters[m])) {
      limiters[m] = [];
    }

    limiters[m][channel] = modifier;
  });

  [model] = model;

  return function boundGetset(...argsBound) {
    let [val] = argsBound;
    let result;

    if (argsBound.length) {
      if (modifier) {
        val = modifier(val);
      }

      /* eslint-disable-next-line babel/no-invalid-this */
      result = this[model]();
      const color = [...result.color];
      color[channel] = val;
      const object = model.split(EMPTY_STRING).reduce((obj, key, index) => {
        obj[key] = color[index];

        return obj;
      }, {});

      /* eslint-disable-next-line babel/no-invalid-this */
      if (this.valpha !== 1) {
        /* eslint-disable-next-line babel/no-invalid-this */
        object.alpha = this.valpha;
      }

      return new Color(object, model);
    }

    /* eslint-disable-next-line babel/no-invalid-this */
    result = this[model]().color[channel];

    if (modifier) {
      result = modifier(result);
    }

    return result;
  };
};

Object.defineProperties(Color.prototype, {
  /* rgb */
  red: {
    configurable: true,
    value: getset(RGB, 0, maxfn255),
    writable: true,
  },
  green: {
    configurable: true,
    value: getset(RGB, 1, maxfn255),
    writable: true,
  },
  blue: {
    configurable: true,
    value: getset(RGB, 2, maxfn255),
    writable: true,
  },

  hue: {
    configurable: true,
    value: getset([HSL, HSV, HWB, HCG], 0, (val) => ((val % 360) + 360) % 360),
    writable: true,
  },

  saturationl: {
    configurable: true,
    value: getset(HSL, 1, maxfn100),
    writable: true,
  },
  lightness: {
    configurable: true,
    value: getset(HSL, 2, maxfn100),
    writable: true,
  },

  saturationv: {
    configurable: true,
    value: getset(HSV, 1, maxfn100),
    writable: true,
  },
  value: {
    configurable: true,
    value: getset(HSV, 2, maxfn100),
    writable: true,
  },

  chroma: {
    configurable: true,
    value: getset(HCG, 1, maxfn100),
    writable: true,
  },
  gray: {
    configurable: true,
    value: getset(HCG, 2, maxfn100),
    writable: true,
  },

  white: {
    configurable: true,
    value: getset(HWB, 1, maxfn100),
    writable: true,
  },
  wblack: {
    configurable: true,
    value: getset(HWB, 2, maxfn100),
    writable: true,
  },

  cyan: {
    configurable: true,
    value: getset(CMYK, 0, maxfn100),
    writable: true,
  },
  magenta: {
    configurable: true,
    value: getset(CMYK, 1, maxfn100),
    writable: true,
  },
  yellow: {
    configurable: true,
    value: getset(CMYK, 2, maxfn100),
    writable: true,
  },
  black: {
    configurable: true,
    value: getset(CMYK, 3, maxfn100),
    writable: true,
  },

  x: {
    configurable: true,
    value: getset(XYZ, 0, maxfn100),
    writable: true,
  },
  y: {
    configurable: true,
    value: getset(XYZ, 1, maxfn100),
    writable: true,
  },
  z: {
    configurable: true,
    value: getset(XYZ, 2, maxfn100),
    writable: true,
  },

  l: {
    configurable: true,
    value: getset(LAB, 0, maxfn100),
    writable: true,
  },
  a: {
    configurable: true,
    value: getset(LAB, 1),
    writable: true,
  },
  b: {
    configurable: true,
    value: getset(LAB, 2),
    writable: true,
  },
});

/* model conversion methods and static constructors */
Object.keys(convert).forEach((model) => {
  if (skippedModels.includes(model)) {
    return;
  }

  const {channels} = convert[model];

  /* conversion methods */
  Object.defineProperty(Color.prototype, model, {
    configurable: true,
    value: function conversionMethod(...args) {
      if (this.model === model) {
        return new Color(this);
      }

      if (args.length) {
        return new Color(args, model);
      }

      const newAlpha = typeof args[channels] === 'number' ? channels : this.valpha;

      return new Color([...castArray(convert[this.model][model].raw(this.color)), newAlpha], model);
    },
    writable: true,
  });

  /* 'static' construction methods */
  Object.defineProperty(Color, model, {
    configurable: true,
    enumerable: true,
    value: function constructionMethod(...args) {
      const [color] = args;
      const col = typeof color === 'number' ? zeroArray(args, channels) : color;

      return new Color(col, model);
    },
    writable: true,
  });
});
