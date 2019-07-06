# colorable-x

<a href="https://travis-ci.org/Xotic750/colorable-x"
title="Travis status">
<img
src="https://travis-ci.org/Xotic750/colorable-x.svg?branch=master"
alt="Travis status" height="18">
</a>
<a href="https://david-dm.org/Xotic750/colorable-x"
title="Dependency status">
<img src="https://david-dm.org/Xotic750/colorable-x/status.svg"
alt="Dependency status" height="18"/>
</a>
<a
href="https://david-dm.org/Xotic750/colorable-x?type=dev"
title="devDependency status">
<img src="https://david-dm.org/Xotic750/colorable-x/dev-status.svg"
alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/colorable-x" title="npm version">
<img src="https://badge.fury.io/js/colorable-x.svg"
alt="npm version" height="18">
</a>

Take a set color palette and get contrast values for every possible combination –
useful for finding safe color combinations with predefined colors
and includes pass/fail scores for the
[WCAG accessibility guidelines](http://www.w3.org/TR/WCAG20/#visual-audio-contrast).

## Getting Started

```bash
npm i --save colorable-x
```

## Usage

Pass an array of color strings or an object with color strings as values.

```js
import colorable from 'colorable-x';

const colors = {
  red: 'red',
  green: 'green',
  blue: 'blue',
};

const result = colorable(colors, {compact: true, threshold: 0});
```

Returns an array of colors with combinations for all other colors and their
[WCAG contrast](http://www.w3.org/TR/WCAG20/#visual-audio-contrast)
values.

```json
[
  {
    "combinations": [
      {
        "contrastRatio": 1.6725321577860943,
        "hexColor": "#008000",
        "name": "green",
        "accessibility": {
          "aa": false,
          "aaa": false,
          "aaaLarge": false,
          "aaLarge": false
        },
        "model": "rgb",
        "color": [0, 128, 0],
        "valpha": 1
      },
      {
        "contrastRatio": 2.148936170212766,
        "hexColor": "#FF0000",
        "name": "red",
        "accessibility": {
          "aa": false,
          "aaa": false,
          "aaaLarge": false,
          "aaLarge": false
        },
        "model": "rgb",
        "color": [255, 0, 0],
        "valpha": 1
      }
    ],
    "hexColor": "#0000FF",
    "name": "blue",
    "model": "rgb",
    "color": [0, 0, 255],
    "valpha": 1
  },
  {
    "combinations": [
      {
        "contrastRatio": 1.6725321577860943,
        "hexColor": "#0000FF",
        "name": "blue",
        "accessibility": {
          "aa": false,
          "aaa": false,
          "aaaLarge": false,
          "aaLarge": false
        },
        "model": "rgb",
        "color": [0, 0, 255],
        "valpha": 1
      },
      {
        "contrastRatio": 1.28483997166146,
        "hexColor": "#FF0000",
        "name": "red",
        "accessibility": {
          "aa": false,
          "aaa": false,
          "aaaLarge": false,
          "aaLarge": false
        },
        "model": "rgb",
        "color": [255, 0, 0],
        "valpha": 1
      }
    ],
    "hexColor": "#008000",
    "name": "green",
    "model": "rgb",
    "color": [0, 128, 0],
    "valpha": 1
  },
  {
    "combinations": [
      {
        "contrastRatio": 2.148936170212766,
        "hexColor": "#0000FF",
        "name": "blue",
        "accessibility": {
          "aa": false,
          "aaa": false,
          "aaaLarge": false,
          "aaLarge": false
        },
        "model": "rgb",
        "color": [0, 0, 255],
        "valpha": 1
      },
      {
        "contrastRatio": 1.28483997166146,
        "hexColor": "#008000",
        "name": "green",
        "accessibility": {
          "aa": false,
          "aaa": false,
          "aaaLarge": false,
          "aaLarge": false
        },
        "model": "rgb",
        "color": [0, 128, 0],
        "valpha": 1
      }
    ],
    "hexColor": "#FF0000",
    "name": "red",
    "model": "rgb",
    "color": [255, 0, 0],
    "valpha": 1
  }
]
```

### Accessibility object

Each key is a boolean value indicating if the color contrast meets the following criteria:

- `aa` - greater than 4.5 (for normal sized text)
- `aaLarge` - greater than 3 ([for bold text or text larger than 24px](http://www.w3.org/TR/WCAG20/#larger-scaledef))
- `aaa` - greater than 7
- `aaaLarge` - greater than 4.5

---

## Options

### `compact`

_Type: Boolean (default: `false`)_

If set to `true`, the result will be a smaller object that only includes hex value color strings, a name for each color (if an object is passed to the function), contrast, and accessibility values.
When set to `false`, the result also includes the entire [Qix-/color](https://www.npmjs.com/package/color) object for each color, which includes other properties and methods for color manipulation.

### `threshold`

_Type: Number (default: `0`)_

When set, the colorable function only returns combinations that have a contrast above this value. This is useful for only seeing combinations that pass a minimum contrast level.

### `uniq`

_Type: Boolean (default: true)_

When set to `true`, the array of colors is passed through lodash.uniq to remove duplicates.

---

MIT License
