# parse-values [![NPM version][npm-image]][npm-url]

[![Greenkeeper badge](https://badges.greenkeeper.io/christophehurpeau/parse-values.svg)](https://greenkeeper.io/)

parse a string of values with separators, quotes and escape, and returns an array

[![Build Status][circleci-status-image]][circleci-status-url][![Travis Status][travisci-status-image]][travisci-status-url][![Dependency Status][daviddm-image]][daviddm-url]
 [![Coverage percentage][coverage-image]][coverage-url]

## Install

```sh
npm install --save parse-values
```

## Usage: parseValues(text: string, firstPotentialSeparators: ?Array<string>, includeFirstSeparator: boolean)

```js
import parseValues from 'parse-values';

console.log(parseValues('test test 2')); // ['test', 'test', '2']
console.log(parseValues('test, test 2')); // ['test', 'test2']
console.log(parseValues('"test", "test \" 2"')); // ['test', 'test " 2']

// with first separator

console.log(parseValues('title ? test test2', ['?'])); // ['title', 'test', 'test2']
console.log(parseValues('title ? test test2', ['?'], true)); // ['title ?', 'test', 'test2']
console.log(parseValues('"title" test test2', ['?'])); // ['title', 'test', 'test2']


```


[npm-image]: https://img.shields.io/npm/v/parse-values.svg?style=flat-square
[npm-url]: https://npmjs.org/package/parse-values
[daviddm-image]: https://david-dm.org/christophehurpeau/parse-values.svg?style=flat-square
[daviddm-url]: https://david-dm.org/christophehurpeau/parse-values
[circleci-status-image]: https://img.shields.io/circleci/project/christophehurpeau/parse-values/master.svg?style=flat-square
[circleci-status-url]: https://circleci.com/gh/christophehurpeau/parse-values
[travisci-status-image]: https://img.shields.io/travisci/project/christophehurpeau/parse-values/master.svg?style=flat-square
[travisci-status-url]: https://travis-ci.org/christophehurpeau/parse-values
[coverage-image]: https://codecov.io/gh/christophehurpeau/parse-values/branch/master/graph/badge.svg?style=flat-square
[coverage-url]: https://codecov.io/gh/christophehurpeau/parse-values
