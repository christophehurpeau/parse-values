const quotes = [
  '"',
  '\'',
  '`',
  '«',
  '“',
  '‘',
];

const endQuotes = new Map([
  [quotes[0], quotes[0]],
  [quotes[1], quotes[1]],
  [quotes[2], quotes[2]],
  [quotes[3], '»'],
  [quotes[4], '”'],
  [quotes[5], '’'],
]);

const escape = '\\';

const basicSeparators = [
  ',',
  ';',
  '\r',
  '\n',
];

const spaceSeparators = [
  ' ',
];


function basicOrSpaceSeparators(text) {
  if (basicSeparators.some(separator => text.includes(separator))) {
    return basicSeparators;
  }

  return spaceSeparators;
}


export default function parseChoices(
  text: string,
  firstPotentialSeparators: ?Array<string>,
  includeFirstSeparator: boolean = false,
) {
  const textLength = text.length;
  const choices = [];

  let endQuote = null;
  let currentChoice = '';

  let separators = firstPotentialSeparators || basicOrSpaceSeparators(text);

  let checkFirstChoice = !firstPotentialSeparators ? () => null : ((i) => {
    if (choices.length === 0) {
      const part = text.substr(i + 1);
      separators = part.includes(',') || part.includes(';') ? basicSeparators : spaceSeparators;
    } else {
      checkFirstChoice = () => null;
    }
  });

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
        throw new Error(`Unexpected ${chr} after ${currentChoice}`);
      }

      endQuote = endQuotes.get(chr);
    } else if (currentChoice.length !== 0 || !chr.match(/\s/)) {
      currentChoice += chr;
    }
  }

  if (currentChoice.length !== 0) {
    if (endQuote) {
      throw new Error(`Unexpected end, expecting ${endQuote} after: ${currentChoice}.`);
    } else {
      choices.push(currentChoice.trim());
    }
  }

  return choices;
}
