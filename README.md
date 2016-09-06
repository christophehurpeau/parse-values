# parse-values [![NPM version][npm-image]][npm-url]

parse a string of values with separators, quotes and escape, and returns an array

[![Build Status][circleci-status-image]][circleci-status-url][![Travis Status][travisci-status-image]][travisci-status-url][![Dependency Status][daviddm-image]][daviddm-url]
 [![Coverage percentage][coverage-image]][coverage-url]

## Install

```sh
npm install --save parse-values
```

## Usage

```js
import parseValues from 'parse-values';

console.log(parseValues('test test 2')); // ['test', 'test', '2']
console.log(parseValues('test, test 2')); // ['test', 'test2']
console.log(parseValues('"test", "test \" 2"')); // ['test', 'test " 2']
```

[npm-image]: https://img.shields.io/npm/v/parse-values.svg?style=flat-square
[npm-url]: https://npmjs.org/package/parse-values
[daviddm-image]: https://david-dm.org//parse-values.svg?style=flat-square
[daviddm-url]: https://david-dm.org//parse-values
[circleci-status-image]: https://img.shields.io/circleci/project//parse-values/master.svg?style=flat-square
[circleci-status-url]: https://circleci.com/gh//parse-values
[travisci-status-image]: https://img.shields.io/travisci/project//parse-values/master.svg?style=flat-square
[travisci-status-url]: https://travis-ci.org//parse-values
[coverage-image]: https://img.shields.io/coveralls//parse-values/master.svg?style=flat-square
[coverage-url]: https://.github.io/parse-values/coverage/lcov-report/