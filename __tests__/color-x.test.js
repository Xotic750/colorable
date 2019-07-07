import Color from '../src/color-x';

describe('color-x', () => {
  it('color() instance', function() {
    expect.assertions(3);
    expect(new Color('red').red()).toBe(255);
    expect(new Color()).toBeInstanceOf(Color);
    const c = new Color();
    expect(c.rgb()).not.toBe(c.rgb());
  });

  it('color() instance (null)', function() {
    expect.assertions(1);
    expect(new Color(null)).toBeInstanceOf(Color);
  });

  it('color() instance (undefined)', function() {
    expect.assertions(1);
    expect(new Color(undefined)).toBeInstanceOf(Color);
  });

  it('immutability', function() {
    expect.assertions(2);
    const c = new Color(0xff0000);
    expect(c).not.toBe(c.rgb());
    /* eslint-disable-next-line eqeqeq */
    expect(c != c.rgb()).toBe(true);
  });

  it('color() argument', function() {
    expect.assertions(15);
    expect(new Color('#0A1E19').rgb().object()).toEqual({
      r: 10,
      g: 30,
      b: 25,
    });
    expect(new Color('rgb(10, 30, 25)').rgb().object()).toEqual({
      r: 10,
      g: 30,
      b: 25,
    });
    expect(new Color('rgba(10, 30, 25, 0.4)').rgb().object()).toEqual({
      r: 10,
      g: 30,
      b: 25,
      alpha: 0.4,
    });
    expect(new Color('rgb(4%, 12%, 10%)').rgb().object()).toEqual({
      r: 10,
      g: 31,
      b: 26,
    });
    expect(new Color('rgba(4%, 12%, 10%, 0.4)').rgb().object()).toEqual({
      r: 10,
      g: 31,
      b: 26,
      alpha: 0.4,
    });
    expect(new Color('blue').rgb().object()).toEqual({
      r: 0,
      g: 0,
      b: 255,
    });
    expect(new Color('hsl(120, 50%, 60%)').hsl().object()).toEqual({
      h: 120,
      s: 50,
      l: 60,
    });
    expect(new Color('hsla(120, 50%, 60%, 0.4)').hsl().object()).toEqual({
      h: 120,
      s: 50,
      l: 60,
      alpha: 0.4,
    });
    expect(new Color('hwb(120, 50%, 60%)').hwb().object()).toEqual({
      h: 120,
      w: 50,
      b: 60,
    });
    expect(new Color('hwb(120, 50%, 60%, 0.4)').hwb().object()).toEqual({
      h: 120,
      w: 50,
      b: 60,
      alpha: 0.4,
    });

    expect(
      new Color({
        r: 10,
        g: 30,
        b: 25,
      })
        .rgb()
        .object(),
    ).toEqual({
      r: 10,
      g: 30,
      b: 25,
    });
    expect(
      new Color({
        h: 10,
        s: 30,
        l: 25,
      })
        .hsl()
        .object(),
    ).toEqual({
      h: 10,
      s: 30,
      l: 25,
    });
    expect(
      new Color({
        h: 10,
        s: 30,
        v: 25,
      })
        .hsv()
        .object(),
    ).toEqual({
      h: 10,
      s: 30,
      v: 25,
    });
    expect(
      new Color({
        h: 10,
        w: 30,
        b: 25,
      })
        .hwb()
        .object(),
    ).toEqual({
      h: 10,
      w: 30,
      b: 25,
    });
    expect(
      new Color({
        c: 10,
        m: 30,
        y: 25,
        k: 10,
      })
        .cmyk()
        .object(),
    ).toEqual({
      c: 10,
      m: 30,
      y: 25,
      k: 10,
    });
  });

  it('setters', function() {
    expect.assertions(10);
    expect(
      Color.rgb(10, 30, 25)
        .rgb()
        .object(),
    ).toEqual({
      r: 10,
      g: 30,
      b: 25,
    });
    expect(
      Color.rgb(10, 30, 25, 0.4)
        .rgb()
        .object(),
    ).toEqual({
      r: 10,
      g: 30,
      b: 25,
      alpha: 0.4,
    });
    expect(
      Color.rgb([10, 30, 25])
        .rgb()
        .object(),
    ).toEqual({
      r: 10,
      g: 30,
      b: 25,
    });
    expect(
      Color.rgb([10, 30, 25, 0.4])
        .rgb()
        .object(),
    ).toEqual({
      r: 10,
      g: 30,
      b: 25,
      alpha: 0.4,
    });
    expect(
      Color.rgb({
        r: 10,
        g: 30,
        b: 25,
      })
        .rgb()
        .object(),
    ).toEqual({
      r: 10,
      g: 30,
      b: 25,
    });
    expect(
      Color.rgb({
        r: 10,
        g: 30,
        b: 25,
        alpha: 0.4,
      })
        .rgb()
        .object(),
    ).toEqual({
      r: 10,
      g: 30,
      b: 25,
      alpha: 0.4,
    });

    expect(
      Color.hsl([260, 10, 10])
        .hsl()
        .object(),
    ).toEqual({
      h: 260,
      s: 10,
      l: 10,
    });
    expect(
      Color.hsv([260, 10, 10])
        .hsv()
        .object(),
    ).toEqual({
      h: 260,
      s: 10,
      v: 10,
    });
    expect(
      Color.hwb([260, 10, 10])
        .hwb()
        .object(),
    ).toEqual({
      h: 260,
      w: 10,
      b: 10,
    });
    expect(
      Color.cmyk([10, 10, 10, 10])
        .cmyk()
        .object(),
    ).toEqual({
      c: 10,
      m: 10,
      y: 10,
      k: 10,
    });
  });

  it('retain Alpha', function() {
    expect.assertions(1);
    expect(
      Color.rgb(1, 2, 3, 0.4)
        .ansi256()
        .rgb()
        .alpha(),
    ).toBe(0.4);
  });

  it('translations', function() {
    expect.assertions(5);
    expect(
      Color.rgb(10, 30, 25)
        .rgb()
        .round()
        .object(),
    ).toEqual({
      r: 10,
      g: 30,
      b: 25,
    });
    expect(
      Color.rgb(10, 30, 25)
        .hsl()
        .round()
        .object(),
    ).toEqual({
      h: 165,
      s: 50,
      l: 8,
    });
    expect(
      Color.rgb(10, 30, 25)
        .hsv()
        .round()
        .object(),
    ).toEqual({
      h: 165,
      s: 67,
      v: 12,
    });
    expect(
      Color.rgb(10, 30, 25)
        .hwb()
        .round()
        .object(),
    ).toEqual({
      h: 165,
      w: 4,
      b: 88,
    });
    expect(
      Color.rgb(10, 30, 25)
        .cmyk()
        .round()
        .object(),
    ).toEqual({
      c: 67,
      m: 0,
      y: 17,
      k: 88,
    });
  });

  it('array getters', function() {
    expect.assertions(9);
    expect(
      new Color({
        r: 10,
        g: 20,
        b: 30,
      })
        .rgb()
        .array(),
    ).toEqual([10, 20, 30]);
    expect(
      new Color({
        r: 10,
        g: 20,
        b: 30,
      }).unitArray(),
    ).toEqual([10 / 255, 20 / 255, 30 / 255]);
    expect(
      new Color({
        r: 10,
        g: 20,
        b: 30,
        alpha: 0.5,
      }).unitArray(),
    ).toEqual([10 / 255, 20 / 255, 30 / 255, 0.5]);
    expect(
      new Color({
        r: 10,
        g: 20,
        b: 30,
      }).unitObject(),
    ).toEqual({
      r: 10 / 255,
      g: 20 / 255,
      b: 30 / 255,
    });
    expect(
      new Color({
        r: 10,
        g: 20,
        b: 30,
        alpha: 0.5,
      }).unitObject(),
    ).toEqual({
      r: 10 / 255,
      g: 20 / 255,
      b: 30 / 255,
      alpha: 0.5,
    });
    expect(
      new Color({
        h: 10,
        s: 20,
        l: 30,
      })
        .hsl()
        .array(),
    ).toEqual([10, 20, 30]);
    expect(
      new Color({
        h: 10,
        s: 20,
        v: 30,
      })
        .hsv()
        .array(),
    ).toEqual([10, 20, 30]);
    expect(
      new Color({
        h: 10,
        w: 20,
        b: 30,
      })
        .hwb()
        .array(),
    ).toEqual([10, 20, 30]);
    expect(
      new Color({
        c: 10,
        m: 20,
        y: 30,
        k: 40,
      })
        .cmyk()
        .array(),
    ).toEqual([10, 20, 30, 40]);
  });

  it('multiple times', function() {
    expect.assertions(2);
    const color = new Color({
      r: 10,
      g: 20,
      b: 30,
    });
    expect(color.rgb().array()).toEqual([10, 20, 30]);
    expect(color.rgb().array()).toEqual([10, 20, 30]);
  });

  it('channel getters/setters', function() {
    expect.assertions(16);
    expect(
      new Color({
        r: 10,
        g: 20,
        b: 30,
        alpha: 0.4,
      }).alpha(),
    ).toBe(0.4);
    expect(
      new Color({
        r: 10,
        g: 20,
        b: 30,
        alpha: 0.4,
      })
        .alpha(0.7)
        .alpha(),
    ).toBe(0.7);
    expect(
      new Color({
        r: 10,
        g: 20,
        b: 30,
      }).red(),
    ).toBe(10);
    expect(
      new Color({
        r: 10,
        g: 20,
        b: 30,
      })
        .red(100)
        .red(),
    ).toBe(100);
    expect(
      new Color({
        r: 10,
        g: 20,
        b: 30,
      }).green(),
    ).toBe(20);
    expect(
      new Color({
        r: 10,
        g: 20,
        b: 30,
      })
        .green(200)
        .green(),
    ).toBe(200);
    expect(
      new Color({
        r: 10,
        g: 20,
        b: 30,
      }).blue(),
    ).toBe(30);
    expect(
      new Color({
        r: 10,
        g: 20,
        b: 30,
      })
        .blue(60)
        .blue(),
    ).toBe(60);
    expect(
      new Color({
        h: 10,
        s: 20,
        l: 30,
      }).hue(),
    ).toBe(10);
    expect(
      new Color({
        h: 10,
        s: 20,
        l: 30,
      })
        .hue(100)
        .hue(),
    ).toBe(100);
    expect(
      new Color({
        h: 10,
        w: 20,
        b: 30,
      }).hue(),
    ).toBe(10);
    expect(
      new Color({
        h: 10,
        w: 20,
        b: 30,
      })
        .hue(100)
        .hue(),
    ).toBe(100);
    expect(
      new Color({
        h: 10,
        s: 20,
        l: 30,
      }).hue(),
    ).toBe(10);
    expect(
      new Color({
        h: 10,
        s: 20,
        l: 30,
      })
        .hue(460)
        .hue(),
    ).toBe(100);
    expect(
      new Color({
        h: 10,
        w: 20,
        b: 30,
      }).hue(),
    ).toBe(10);
    expect(
      new Color({
        h: 10,
        w: 20,
        b: 30,
      })
        .hue(-260)
        .hue(),
    ).toBe(100);
  });

  it('setting the same value', function() {
    expect.assertions(29);
    const colorString = '#BADA55';
    const color = new Color(colorString);
    const alpha = color.alpha();
    const red = color.red();
    const green = color.green();
    const blue = color.blue();
    const hue = color.hue();
    const saturation = color.saturationl();
    const saturationv = color.saturationv();
    const lightness = color.lightness();
    const whiteness = color.white();
    const blackness = color.wblack();
    const cyan = color.cyan();
    const magenta = color.magenta();
    const yellow = color.yellow();
    const black = color.black();

    expect(color.hex()).toBe(colorString);

    color.alpha(alpha);
    expect(color.alpha()).toBe(alpha);
    expect(color.hex()).toBe(colorString);

    color.red(red);
    expect(color.red()).toBe(red);
    expect(color.hex()).toBe(colorString);

    color.green(green);
    expect(color.green()).toBe(green);
    expect(color.hex()).toBe(colorString);

    color.blue(blue);
    expect(color.blue()).toBe(blue);
    expect(color.hex()).toBe(colorString);

    color.hue(hue);
    expect(color.hue()).toBe(hue);
    expect(color.hex()).toBe(colorString);

    color.saturationl(saturation);
    expect(color.saturationl()).toBe(saturation);
    expect(color.hex()).toBe(colorString);

    color.saturationv(saturationv);
    expect(color.saturationv()).toBe(saturationv);
    expect(color.hex()).toBe(colorString);

    color.lightness(lightness);
    expect(color.lightness()).toBe(lightness);
    expect(color.hex()).toBe(colorString);

    color.white(whiteness);
    expect(color.white()).toBe(whiteness);
    expect(color.hex()).toBe(colorString);

    color.wblack(blackness);
    expect(color.wblack()).toBe(blackness);
    expect(color.hex()).toBe(colorString);

    color.cyan(cyan);
    expect(color.cyan()).toBe(cyan);
    expect(color.hex()).toBe(colorString);

    color.magenta(magenta);
    expect(color.magenta()).toBe(magenta);
    expect(color.hex()).toBe(colorString);

    color.yellow(yellow);
    expect(color.yellow()).toBe(yellow);
    expect(color.hex()).toBe(colorString);

    color.black(black);
    expect(color.black()).toBe(black);
    expect(color.hex()).toBe(colorString);
  });

  it('capping values', function() {
    expect.assertions(12);
    expect(
      new Color({
        h: 400,
        s: 50,
        l: 10,
      }).hue(),
    ).toBe(40);
    expect(
      new Color({
        h: 100,
        s: 50,
        l: 80,
      })
        .lighten(0.5)
        .lightness(),
    ).toBe(100);
    expect(
      new Color({
        h: -400,
        s: 50,
        l: 10,
      }).hue(),
    ).toBe(320);

    // 0 == 360
    expect(
      new Color({
        h: 400,
        w: 50,
        b: 10,
      }).hue(),
    ).toBe(40);
    expect(
      new Color({
        h: 100,
        w: 50,
        b: 80,
      })
        .blacken(0.5)
        .wblack(),
    ).toBe(100);
    expect(
      new Color({
        h: -400,
        w: 50,
        b: 10,
      }).hue(),
    ).toBe(320);

    expect(new Color().red(400).red()).toBe(255);
    expect(new Color().red(-400).red()).toBe(0);
    expect(Color.rgb(10, 10, 10, 12).alpha()).toBe(1);
    expect(Color.rgb(10, 10, 10, -200).alpha()).toBe(0);
    expect(new Color().alpha(-12).alpha()).toBe(0);
    expect(new Color().alpha(3).alpha()).toBe(1);
  });

  it('translate with channel setters', function() {
    expect.assertions(2);
    expect(
      new Color({
        r: 0,
        g: 0,
        b: 0,
      })
        .lightness(50)
        .hsl()
        .object(),
    ).toEqual({
      h: 0,
      s: 0,
      l: 50,
    });
    expect(
      new Color({
        r: 0,
        g: 0,
        b: 0,
      })
        .red(50)
        .green(50)
        .hsv()
        .round()
        .object(),
    ).toEqual({
      h: 60,
      s: 100,
      v: 20,
    });
  });

  it('cSS String getters', function() {
    expect.assertions(12);
    expect(new Color('rgb(10, 30, 25)').hex()).toBe('#0A1E19');
    expect(new Color('rgb(10, 30, 25)').rgb().string()).toBe('rgb(10, 30, 25)');
    expect(new Color('rgb(10, 30, 25, 0.4)').rgb().string()).toBe('rgba(10, 30, 25, 0.4)');
    expect(new Color('rgb(10, 30, 25)').percentString()).toBe('rgb(4%, 12%, 10%)');
    expect(new Color('rgb(10, 30, 25, 0.3)').percentString()).toBe('rgba(4%, 12%, 10%, 0.3)');
    expect(new Color('rgb(10, 30, 25)').hsl().string()).toBe('hsl(165, 50%, 7.8%)');
    expect(new Color('rgb(10, 30, 25, 0.3)').hsl().string()).toBe('hsla(165, 50%, 7.8%, 0.3)');
    expect(
      new Color({
        h: 0,
        s: 0,
        v: 100,
      })
        .hsl()
        .string(),
    ).toBe('hsl(0, 0%, 100%)');
    expect(new Color('rgb(10, 30, 25)').hwb().string(0)).toBe('hwb(165, 4%, 88%)');
    expect(new Color('rgb(10, 30, 25, 0.3)').hwb().string(0)).toBe('hwb(165, 4%, 88%, 0.3)');
    expect(new Color('rgb(0, 0, 255)').keyword()).toBe('blue');
    expect(Color.rgb(155.5, 243.1555, 88.1999).string()).toBe('rgb(156, 243, 88)');
  });

  it('number getters', function() {
    expect.assertions(1);
    expect(new Color('rgb(10, 30, 25)').rgbNumber()).toBe(0xa1e19);
  });

  it('luminosity, etc.', function() {
    expect.assertions(16);
    expect(new Color('white').luminosity()).toBe(1);
    expect(new Color('black').luminosity()).toBe(0);
    expect(new Color('red').luminosity()).toBe(0.2126);
    expect(new Color('white').contrast(new Color('black'))).toBe(21);
    expect(Math.round(new Color('white').contrast(new Color('red')))).toBe(4);
    expect(Math.round(new Color('red').contrast(new Color('white')))).toBe(4);
    expect(new Color('blue').contrast(new Color('blue'))).toBe(1);
    expect(new Color('black').isDark()).toBe(true);
    expect(new Color('black').isLight()).toBe(false);
    expect(new Color('white').isLight()).toBe(true);
    expect(new Color('white').isDark()).toBe(false);
    expect(new Color('blue').isDark()).toBe(true);
    expect(new Color('darkgreen').isDark()).toBe(true);
    expect(new Color('pink').isLight()).toBe(true);
    expect(new Color('goldenrod').isLight()).toBe(true);
    expect(new Color('red').isDark()).toBe(true);
  });

  it('manipulators wo/ mix', function() {
    expect.assertions(12);
    expect(
      new Color({
        r: 67,
        g: 122,
        b: 134,
      })
        .grayscale()
        .rgb()
        .round()
        .object(),
    ).toEqual({
      r: 107,
      g: 107,
      b: 107,
    });
    expect(
      new Color({
        r: 67,
        g: 122,
        b: 134,
      })
        .negate()
        .rgb()
        .round()
        .object(),
    ).toEqual({
      r: 188,
      g: 133,
      b: 121,
    });
    expect(
      new Color({
        h: 100,
        s: 50,
        l: 60,
      })
        .lighten(0.5)
        .lightness(),
    ).toBe(90);
    expect(
      new Color({
        h: 100,
        s: 50,
        l: 60,
      })
        .darken(0.5)
        .lightness(),
    ).toBe(30);
    expect(
      new Color({
        h: 100,
        w: 50,
        b: 60,
      })
        .whiten(0.5)
        .white(),
    ).toBe(75);
    expect(
      new Color({
        h: 100,
        w: 50,
        b: 60,
      })
        .blacken(0.5)
        .wblack(),
    ).toBe(90);
    expect(
      new Color({
        h: 100,
        s: 40,
        l: 50,
      })
        .saturate(0.5)
        .saturationl(),
    ).toBe(60);
    expect(
      new Color({
        h: 100,
        s: 80,
        l: 60,
      })
        .desaturate(0.5)
        .saturationl(),
    ).toBe(40);
    expect(
      new Color({
        r: 10,
        g: 10,
        b: 10,
        alpha: 0.8,
      })
        .fade(0.5)
        .alpha(),
    ).toBe(0.4);
    expect(
      new Color({
        r: 10,
        g: 10,
        b: 10,
        alpha: 0.5,
      })
        .opaquer(0.5)
        .alpha(),
    ).toBe(0.75);
    expect(
      new Color({
        h: 60,
        s: 0,
        l: 0,
      })
        .rotate(180)
        .hue(),
    ).toBe(240);
    expect(
      new Color({
        h: 60,
        s: 0,
        l: 0,
      })
        .rotate(-180)
        .hue(),
    ).toBe(240);
  });

  it('mix: basic', function() {
    expect.assertions(1);
    expect(new Color('#f00').mix(new Color('#00f')).hex()).toBe('#800080');
  });

  it('mix: weight', function() {
    expect.assertions(1);
    expect(new Color('#f00').mix(new Color('#00f'), 0.25).hex()).toBe('#BF0040');
  });

  it('mix: alpha', function() {
    expect.assertions(1);
    expect(
      new Color('rgba(255, 0, 0, 0.5)')
        .mix(new Color('#00f'))
        .rgb()
        .string(0),
    ).toBe('rgba(64, 0, 191, 0.75)');
  });

  it('mix: 0%', function() {
    expect.assertions(1);
    expect(new Color('#f00').mix(new Color('#00f'), 0).hex()).toBe('#FF0000');
  });

  it('mix: 25%', function() {
    expect.assertions(1);
    expect(new Color('#f00').mix(new Color('#00f'), 0.25).hex()).toBe('#BF0040');
  });

  it('mix: 50%', function() {
    expect.assertions(1);
    expect(new Color('#f00').mix(new Color('#00f'), 0.5).hex()).toBe('#800080');
  });

  it('mix: 75%', function() {
    expect.assertions(1);
    expect(new Color('#f00').mix(new Color('#00f'), 0.75).hex()).toBe('#4000BF');
  });

  it('mix: 100%', function() {
    expect.assertions(1);
    expect(new Color('#f00').mix(new Color('#00f'), 1.0).hex()).toBe('#0000FF');
  });

  it('level', function() {
    expect.assertions(2);
    expect(new Color('white').level(new Color('black'))).toBe('AAA');
    expect(new Color('grey').level(new Color('black'))).toBe('AA');
  });

  it('exceptions', function() {
    expect.assertions(3);
    expect(() => {
      /* eslint-disable-next-line no-new */
      new Color('unknow');
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      /* eslint-disable-next-line no-new */
      new Color({});
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      /* eslint-disable-next-line no-new */
      new Color('');
    }).toThrowErrorMatchingSnapshot();
  });
});
