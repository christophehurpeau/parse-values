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
//# sourceMappingURL=index.js.map