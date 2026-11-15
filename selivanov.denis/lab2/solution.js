export function convertBase(num, fromBase, toBase) {
  const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
  const input = String(num).trim().toLowerCase();
  const negative = input[0] === '-';
  const start = negative || input[0] === '+' ? 1 : 0;
  let decimal = 0;

  for (let i = start; i < input.length; i++) {
    const digit = digits.indexOf(input[i]);
    decimal = decimal * fromBase + digit;
  }

  if (decimal === 0) {
    return '0';
  }

  let result = '';

  while (decimal > 0) {
    const remainder = decimal % toBase;
    result = digits[remainder] + result;
    decimal = Math.floor(decimal / toBase);
  }

  return negative ? `-${result}` : result;
}
