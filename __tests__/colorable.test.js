import colors from 'colors.css/js/colors';
import Color from '@xotic750/color';
import colorable, {Colorable, Combination, minimums} from 'src/colorable';

const colorsCSS = Object.freeze({...colors});
const primaryColors = Object.freeze({
  blue: 'blue',
  green: 'green',
  red: 'red',
});

const primaryColorsNull = Object.freeze(
  Object.create(null, {
    blue: {
      enumerable: true,
      value: 'blue',
    },
    green: {
      enumerable: true,
      value: 'green',
    },
    red: {
      enumerable: true,
      value: 'red',
    },
  }),
);

const bassColors = Object.freeze(['#0076DF', '#FF4919', '#00DF3F', '#FFCF00', '#333', '#777', '#CCC', '#EEE']);
const bassColorsRepeat = Object.freeze([...bassColors, ...bassColors]);
const bassdockColors = Object.freeze([
  '#304650',
  '#667680',
  '#C3C9C9',
  '#F3F9F9',
  '#0089FF',
  '#F95C10',
  '#00EF60',
  '#FFDF00',
  '#00B9FF',
]);

describe('colorable', () => {
  describe('minimums', () => {
    it('matches snapshot', () => {
      expect.assertions(1);

      expect(minimums).toMatchSnapshot();
    });
  });

  describe('test Colorable', () => {
    it('is constructor and has correct inheritance', () => {
      expect.assertions(4);

      expect(Colorable).toBeInstanceOf(Function);
      const actual = new Colorable({name: 'red', value: primaryColorsNull.red});
      expect(actual).toBeInstanceOf(Colorable);
      expect(actual).toBeInstanceOf(Color);
      expect(actual).toMatchSnapshot();
    });
  });

  describe('throws a TypeError for non-array or non-object', () => {
    it('undefined', () => {
      expect.assertions(1);

      expect(() => {
        colorable();
      }).toThrowErrorMatchingSnapshot();
    });

    it('null', () => {
      expect.assertions(1);

      expect(() => {
        colorable(null);
      }).toThrowErrorMatchingSnapshot();
    });

    it('number', () => {
      expect.assertions(1);

      expect(() => {
        colorable(1);
      }).toThrowErrorMatchingSnapshot();
    });

    it('string', () => {
      expect.assertions(1);

      expect(() => {
        colorable('1');
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('empty array', () => {
    it('matches snapshot', () => {
      expect.assertions(1);

      expect(colorable([])).toMatchSnapshot();
    });
  });

  describe('empty object', () => {
    it('matches snapshot', () => {
      expect.assertions(1);

      expect(colorable({})).toMatchSnapshot();
    });
  });

  describe('empty null object', () => {
    it('matches snapshot', () => {
      expect.assertions(1);

      expect(colorable(Object.create(null))).toMatchSnapshot();
    });
  });

  describe('colors object', () => {
    it('no user options', () => {
      expect.assertions(3);
      const actual = colorable(colorsCSS);
      expect(actual).toBeInstanceOf(Array);
      const everyColorable = actual.every((item) => item instanceof Colorable);
      expect(everyColorable).toBe(true);
      expect(actual).toMatchSnapshot();
    });

    it('compact true', () => {
      expect.assertions(5);
      const actual = colorable(colorsCSS, {compact: true});
      expect(actual).toBeInstanceOf(Array);
      const everyColorable = actual.every((item) => Boolean(item) && typeof item === 'object' && !(item instanceof Colorable));
      expect(everyColorable).toBe(true);
      expect(everyColorable).toBe(true);
      const everyContrast = actual.every((item) => {
        return item.combinations.every((combination) => !(combination instanceof Combination) && combination.contrastRatio > 0);
      });
      expect(everyContrast).toBe(true);
      expect(actual).toMatchSnapshot();
    });

    it('uniq false', () => {
      expect.assertions(5);
      const actual = colorable(colorsCSS, {uniq: false});
      expect(actual).toBeInstanceOf(Array);
      expect(actual).toHaveLength(Object.keys(colorsCSS).length);
      const everyColorable = actual.every((item) => item instanceof Colorable);
      expect(everyColorable).toBe(true);
      const everyContrast = actual.every((item) => {
        return item.combinations.every((combination) => combination instanceof Combination && item.contrast(combination) > 0);
      });
      expect(everyContrast).toBe(true);
      expect(actual).toMatchSnapshot();
    });

    it('threshold 3', () => {
      expect.assertions(4);
      const actual = colorable(colorsCSS, {threshold: 3});
      expect(actual).toBeInstanceOf(Array);
      const everyColorable = actual.every((item) => item instanceof Colorable);
      expect(everyColorable).toBe(true);
      const everyContrast = actual.every((item) => {
        return item.combinations.every((combination) => combination instanceof Combination && item.contrast(combination) > 3);
      });
      expect(everyContrast).toBe(true);
      expect(actual).toMatchSnapshot();
    });

    it('compact true threshold 3', () => {
      expect.assertions(5);
      const actual = colorable(colorsCSS, {compact: true, threshold: 3});
      expect(actual).toBeInstanceOf(Array);
      const everyColorable = actual.every((item) => Boolean(item) && typeof item === 'object' && !(item instanceof Colorable));
      expect(everyColorable).toBe(true);
      expect(everyColorable).toBe(true);
      const everyContrast = actual.every((item) => {
        return item.combinations.every((combination) => !(combination instanceof Combination) && combination.contrastRatio > 3);
      });
      expect(everyContrast).toBe(true);
      expect(actual).toMatchSnapshot();
    });
  });

  describe('primaryColors object', () => {
    it('no user options', () => {
      expect.assertions(1);
      expect(colorable(primaryColors)).toMatchSnapshot();
    });

    it('compact true', () => {
      expect.assertions(1);
      expect(colorable(primaryColors, {compact: true})).toMatchSnapshot();
    });

    it('uniq false', () => {
      expect.assertions(1);
      expect(colorable(primaryColors, {uniq: false})).toMatchSnapshot();
    });

    it('threshold 3', () => {
      expect.assertions(1);
      expect(colorable(primaryColors, {threshold: 3})).toMatchSnapshot();
    });
  });

  describe('primaryColors null object', () => {
    it('no user options', () => {
      expect.assertions(1);
      expect(colorable(primaryColorsNull)).toMatchSnapshot();
    });

    it('compact true', () => {
      expect.assertions(1);
      expect(colorable(primaryColorsNull, {compact: true})).toMatchSnapshot();
    });

    it('uniq false', () => {
      expect.assertions(1);
      expect(colorable(primaryColorsNull, {uniq: false})).toMatchSnapshot();
    });

    it('threshold 3', () => {
      expect.assertions(1);
      expect(colorable(primaryColorsNull, {threshold: 3})).toMatchSnapshot();
    });
  });

  describe('bassColors array', () => {
    it('no user options', () => {
      expect.assertions(2);
      const actual = colorable(bassColors);
      expect(actual).toMatchSnapshot();
      const everyActual = actual.every((item) => Array.isArray(item.combinations));
      expect(everyActual).toBe(true);
    });

    it('compact true', () => {
      expect.assertions(1);
      expect(colorable(bassColors, {compact: true})).toMatchSnapshot();
    });

    it('uniq false', () => {
      expect.assertions(1);
      expect(colorable(bassColors, {uniq: false})).toMatchSnapshot();
    });

    it('threshold 3', () => {
      expect.assertions(1);
      expect(colorable(bassColors, {threshold: 3})).toMatchSnapshot();
    });
  });

  describe('bassColorsRepeat array', () => {
    it('no user options', () => {
      expect.assertions(1);
      expect(colorable(bassColorsRepeat)).toMatchSnapshot();
    });

    it('compact true', () => {
      expect.assertions(1);
      expect(colorable(bassColorsRepeat, {compact: true})).toMatchSnapshot();
    });

    it('uniq false', () => {
      expect.assertions(1);
      expect(colorable(bassColorsRepeat, {uniq: false})).toMatchSnapshot();
    });

    it('threshold 3', () => {
      expect.assertions(1);
      expect(colorable(bassColorsRepeat, {threshold: 3})).toMatchSnapshot();
    });
  });

  describe('bassdockColors array', () => {
    it('no user options', () => {
      expect.assertions(1);
      expect(colorable(bassdockColors)).toMatchSnapshot();
    });

    it('compact true', () => {
      expect.assertions(1);
      expect(colorable(bassdockColors, {compact: true})).toMatchSnapshot();
    });

    it('uniq false', () => {
      expect.assertions(1);
      expect(colorable(bassdockColors, {uniq: false})).toMatchSnapshot();
    });

    it('threshold 3', () => {
      expect.assertions(1);
      expect(colorable(bassdockColors, {threshold: 3})).toMatchSnapshot();
    });
  });
});
