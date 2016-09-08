/* global suite, test */

import { deepStrictEqual, throws } from 'assert';
import parseValues from '../../';

suite('quotes', () => {
  test('simple quoted value', () => {
    deepStrictEqual(parseValues('\'test\''), ['test']);
  });

  test('double quoted value', () => {
    deepStrictEqual(parseValues('"test"'), ['test']);
  });

  test('angle quoted value', () => {
    deepStrictEqual(parseValues('« test »'), ['test']);
  });

  test('quoted with quotation mark value', () => {
    deepStrictEqual(parseValues('“test”'), ['test']);
  });

  test('quoted with apostrophe value', () => {
    deepStrictEqual(parseValues('‘test’'), ['test']);
  });


  test('double quoted with escape', () => {
    deepStrictEqual(parseValues('"\\"test\\""'), ['"test"']);
  });

  test('simple throws when quote is not ended', () => {
    throws(
      () => parseValues('"test'),
      /^Error: Unexpected end, expecting " after: test\.$/,
    );
  });

  test('simple throws when found a quote after a choice started', () => {
    throws(
      () => parseValues('test"test'),
      /^Error: Unexpected " after test$/,
    );
  });
});

suite('values separated by spaces', () => {
  test('two values', () => {
    deepStrictEqual(parseValues('test test2'), ['test', 'test2']);
  });

  test('two values, with quotes', () => {
    deepStrictEqual(parseValues('"test" test2'), ['test', 'test2']);
  });

  test('two values, with quotes collapsed', () => {
    deepStrictEqual(parseValues('"test""test2"'), ['test', 'test2']);
  });
});

suite('values separated by comma', () => {
  test('two values', () => {
    deepStrictEqual(parseValues('test, test2'), ['test', 'test2']);
  });

  test('two values, with quotes', () => {
    deepStrictEqual(parseValues('"test", test2'), ['test', 'test2']);
  });

  test('two values, with quotes and space', () => {
    deepStrictEqual(
      parseValues('"test test", \'test2 test2\''),
      ['test test', 'test2 test2'],
    );
  });
});


suite('? as a first separator', () => {
  test('with space', () => {
    deepStrictEqual(parseValues('title ? test test2', ['?']), ['title', 'test', 'test2']);
  });

  test('without space', () => {
    deepStrictEqual(parseValues('title? test test2', ['?']), ['title', 'test', 'test2']);
  });

  test('and used latter', () => {
    deepStrictEqual(parseValues('title ? test ? test2', ['?']), ['title', 'test', '?', 'test2']);
  });

  test('but not used', () => {
    deepStrictEqual(parseValues('"title" test test2', ['?']), ['title', 'test', 'test2']);
  });

  test('include separator', () => {
    deepStrictEqual(
      parseValues('title ? test ? test2', ['?'], true),
      ['title ?', 'test', '?', 'test2'],
    );
  });
});
