'use strict';

var _assert = require('assert');

var _ = require('../../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global suite, test */

suite('quotes', () => {
  test('simple quoted value', () => {
    (0, _assert.deepStrictEqual)((0, _2.default)('\'test\''), ['test']);
  });

  test('double quoted value', () => {
    (0, _assert.deepStrictEqual)((0, _2.default)('"test"'), ['test']);
  });

  test('angle quoted value', () => {
    (0, _assert.deepStrictEqual)((0, _2.default)('« test »'), ['test']);
  });

  test('quoted with quotation mark value', () => {
    (0, _assert.deepStrictEqual)((0, _2.default)('“test”'), ['test']);
  });

  test('quoted with apostrophe value', () => {
    (0, _assert.deepStrictEqual)((0, _2.default)('‘test’'), ['test']);
  });

  test('double quoted with escape', () => {
    (0, _assert.deepStrictEqual)((0, _2.default)('"\\"test\\""'), ['"test"']);
  });

  test('simple throws when quote is not ended', () => {
    (0, _assert.throws)(() => (0, _2.default)('"test'), /^Error: Unexpected end, expecting " after: test\.$/);
  });

  test('simple throws when found a quote after a choice started', () => {
    (0, _assert.throws)(() => (0, _2.default)('test"test'), /^Error: Unexpected " after test$/);
  });
});

suite('values separated by spaces', () => {
  test('two values', () => {
    (0, _assert.deepStrictEqual)((0, _2.default)('test test2'), ['test', 'test2']);
  });

  test('two values, with quotes', () => {
    (0, _assert.deepStrictEqual)((0, _2.default)('"test" test2'), ['test', 'test2']);
  });

  test('two values, with quotes collapsed', () => {
    (0, _assert.deepStrictEqual)((0, _2.default)('"test""test2"'), ['test', 'test2']);
  });
});

suite('values separated by comma', () => {
  test('two values', () => {
    (0, _assert.deepStrictEqual)((0, _2.default)('test, test2'), ['test', 'test2']);
  });

  test('two values, with quotes', () => {
    (0, _assert.deepStrictEqual)((0, _2.default)('"test", test2'), ['test', 'test2']);
  });

  test('two values, with quotes and space', () => {
    (0, _assert.deepStrictEqual)((0, _2.default)('"test test", \'test2 test2\''), ['test test', 'test2 test2']);
  });
});

suite('? as a first separator', () => {
  test('with space', () => {
    (0, _assert.deepStrictEqual)((0, _2.default)('title ? test test2', ['?']), ['title', 'test', 'test2']);
  });

  test('without space', () => {
    (0, _assert.deepStrictEqual)((0, _2.default)('title? test test2', ['?']), ['title', 'test', 'test2']);
  });

  test('and used latter', () => {
    (0, _assert.deepStrictEqual)((0, _2.default)('title ? test ? test2', ['?']), ['title', 'test', '?', 'test2']);
  });

  test('but not used', () => {
    (0, _assert.deepStrictEqual)((0, _2.default)('"title" test test2', ['?']), ['title', 'test', 'test2']);
  });

  test('include separator', () => {
    (0, _assert.deepStrictEqual)((0, _2.default)('title ? test ? test2', ['?'], true), ['title ?', 'test', '?', 'test2']);
  });
});
//# sourceMappingURL=index.js.map