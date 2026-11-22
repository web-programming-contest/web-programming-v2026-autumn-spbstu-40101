function isLetter(ch) {
  const code = ch.charCodeAt(0);
  return (
    (code >= 65 && code <= 90) ||
    (code >= 97 && code <= 122) ||
    (code >= 1040 && code <= 1103) ||
    code === 1025 || // Ё
    code === 1105 // ё
  );
}

function isDigit(ch) {
  const code = ch.charCodeAt(0);
  return code >= 48 && code <= 57;
}

export function analyzieString(str) {
  const result = {letters: 0, digits: 0, spaces: 0, other: 0};

  for (const ch of str) {
    if (isLetter(ch)) {
      result.letters++;
    } else if (isDigit(ch)) {
      result.digits++;
    } else if (ch === ' ') {
      result.spaces++;
    } else {
      result.other++;
    }
  }

  return result;
}
