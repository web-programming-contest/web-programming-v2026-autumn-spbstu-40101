const DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function assertBase(base) {
  if (!Number.isInteger(base) || base < 2 || base > 36) {
    throw new RangeError('Основание должно быть целым числом от 2 до 36');
  }
}

/**
 * Преобразует целое число между системами счисления (основания 2–36).
 * @param {string | number} num - исходное число (регистр цифр не важен, допустим знак "-")
 * @param {number} fromBase - исходное основание
 * @param {number} toBase - целевое основание
 * @returns {string} число в целевой системе (цифры в верхнем регистре)
 */
export function convertBase(num, fromBase, toBase) {
  assertBase(fromBase);
  assertBase(toBase);

  let text = String(num).trim().toUpperCase();
  const negative = text.startsWith('-');
  if (negative || text.startsWith('+')) {
    text = text.slice(1);
  }
  if (text === '') {
    throw new SyntaxError('Пустое число');
  }

  const from = BigInt(fromBase);
  let value = 0n;
  for (const char of text) {
    const digit = DIGITS.indexOf(char);
    if (digit === -1 || digit >= fromBase) {
      throw new SyntaxError(
        `Недопустимая цифра "${char}" для основания ${fromBase}`,
      );
    }
    value = value * from + BigInt(digit);
  }

  if (value === 0n) {
    return '0';
  }

  const to = BigInt(toBase);
  let result = '';
  while (value > 0n) {
    result = DIGITS[Number(value % to)] + result;
    value /= to;
  }
  return negative ? `-${result}` : result;
}
