'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseChoices;
const quotes = ['"', '\'', '`', '«', '“', '‘'];

const endQuotes = new Map([[quotes[0], quotes[0]], [quotes[1], quotes[1]], [quotes[2], quotes[2]], [quotes[3], '»'], [quotes[4], '”'], [quotes[5], '’']]);

const escape = '\\';

const basicSeparators = [',', ';', '\r', '\n'];

const spaceSeparators = [' '];

function basicOrSpaceSeparators(text) {
  if (basicSeparators.some(separator => {
    return text.includes(separator);
  })) {
    return basicSeparators;
  }

  return spaceSeparators;
}

function parseChoices(text, firstPotentialSeparators) {
  let includeFirstSeparator = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  if (!(typeof text === 'string')) {
    throw new TypeError('Value of argument "text" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(text));
  }

  if (!(firstPotentialSeparators == null || Array.isArray(firstPotentialSeparators) && firstPotentialSeparators.every(function (item) {
    return typeof item === 'string';
  }))) {
    throw new TypeError('Value of argument "firstPotentialSeparators" violates contract.\n\nExpected:\n?Array<string>\n\nGot:\n' + _inspect(firstPotentialSeparators));
  }

  if (!(typeof includeFirstSeparator === 'boolean')) {
    throw new TypeError('Value of argument "includeFirstSeparator" violates contract.\n\nExpected:\nbool\n\nGot:\n' + _inspect(includeFirstSeparator));
  }

  const textLength = text.length;
  const choices = [];

  let endQuote = null;
  let currentChoice = '';

  let separators = firstPotentialSeparators || basicOrSpaceSeparators(text);

  let checkFirstChoice = !firstPotentialSeparators ? () => {
    return null;
  } : i => {
    if (choices.length === 0) {
      const part = text.substr(i + 1);
      separators = part.includes(',') || part.includes(';') ? basicSeparators : spaceSeparators;
    } else {
      checkFirstChoice = () => {
        return null;
      };
    }
  };

  for (let i = 0; i < textLength; i++) {
    const chr = text[i];

    if (!endQuote && separators.includes(chr)) {
      if (currentChoice.length !== 0) {
        checkFirstChoice(i);

        if (includeFirstSeparator) currentChoice += chr;
        choices.push(currentChoice.trim());
        currentChoice = '';
      }
    } else if (endQuote && chr === escape && text[i + 1] === endQuote) {
      // skip quote
      i += 1;
      currentChoice += endQuote;
    } else if (endQuote && chr === endQuote) {
      checkFirstChoice(i);
      choices.push(currentChoice.trim());
      currentChoice = '';
      endQuote = null;
    } else if (!endQuote && quotes.includes(chr)) {
      if (currentChoice.length !== 0) {
        throw new Error(`Unexpected ${ chr } after ${ currentChoice }`);
      }

      endQuote = endQuotes.get(chr);
    } else if (currentChoice.length !== 0 || !chr.match(/\s/)) {
      currentChoice += chr;
    }
  }

  if (currentChoice.length !== 0) {
    if (endQuote) {
      throw new Error(`Unexpected end, expecting ${ endQuote } after: ${ currentChoice }.`);
    } else {
      choices.push(currentChoice.trim());
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