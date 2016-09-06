'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseChoices;
const quotes = ['"'.charCodeAt(), '\''.charCodeAt(), '`'.charCodeAt()];

const escape = '\\'.charCodeAt();

const basicSeparators = [','.charCodeAt(), ';'.charCodeAt(), '\r'.charCodeAt(), '\n'.charCodeAt()];

const spaceSeparators = [...basicSeparators, ' '.charCodeAt()];

function parseChoices(text) {
  if (!(typeof text === 'string')) {
    throw new TypeError('Value of argument "text" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(text));
  }

  const buffer = Buffer.from(`${ text }`);
  const bufferLength = buffer.length;
  const choices = [];

  let quote = null;
  let currentChoice = '';

  let separators = text.includes(',') || text.includes(';') ? basicSeparators : spaceSeparators;

  for (let i = 0; i < bufferLength; i++) {
    const chr = buffer[i];

    if (!quote && separators.includes(chr)) {
      if (currentChoice.length) {
        choices.push(currentChoice);
        currentChoice = '';
      }
    } else if (quote && chr === escape && buffer[i + 1] === quote) {
      // skip quote
      i += 1;
      currentChoice += String.fromCharCode(quote);
    } else if (quote && chr === quote) {
      choices.push(currentChoice);
      currentChoice = '';
      quote = null;
    } else if (!quote && quotes.includes(chr)) {
      if (currentChoice.length) {
        throw new Error(`Unexpected ${ String.fromCharCode(chr) } after ${ currentChoice }`);
      }

      quote = chr;
    } else {
      const str = String.fromCharCode(chr);
      if (currentChoice.length !== 0 || !str.match(/\s/)) {
        currentChoice += str;
      }
    }
  }

  if (currentChoice.length) {
    if (quote) {
      throw new Error(`Unexpected end, the quote ${ String.fromCharCode(quote) } never ended.`);
    } else {
      choices.push(currentChoice);
    }
  }

  return choices;
}

function _inspect(input, depth) {
  const maxDepth = 4;
  const maxKeys = 15;

  if (depth === undefined) {
    depth = 0;
  }

  depth += 1;

  if (input === null) {
    return 'null';
  } else if (input === undefined) {
    return 'void';
  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    return typeof input;
  } else if (Array.isArray(input)) {
    if (input.length > 0) {
      if (depth > maxDepth) return '[...]';

      const first = _inspect(input[0], depth);

      if (input.every(item => _inspect(item, depth) === first)) {
        return first.trim() + '[]';
      } else {
        return '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']';
      }
    } else {
      return 'Array';
    }
  } else {
    const keys = Object.keys(input);

    if (!keys.length) {
      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
        return input.constructor.name;
      } else {
        return 'Object';
      }
    }

    if (depth > maxDepth) return '{...}';
    const indent = '  '.repeat(depth - 1);
    let entries = keys.slice(0, maxKeys).map(key => {
      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
    }).join('\n  ' + indent);

    if (keys.length >= maxKeys) {
      entries += '\n  ' + indent + '...';
    }

    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
      return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
    } else {
      return '{\n  ' + indent + entries + '\n' + indent + '}';
    }
  }
}
//# sourceMappingURL=index.js.map