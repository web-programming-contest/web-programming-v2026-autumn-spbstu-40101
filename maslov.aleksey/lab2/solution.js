function findLongestPalindrome(str) {
  const n = str.length;
  if (n === 0) {
    return '';
  }

  const d1 = new Array(n).fill(0);
  let l1 = 0;
  let r1 = -1;

  for (let i = 0; i < n; i++) {
    let k = 0;
    if (i <= r1) {
      const j = l1 + r1 - i;
      k = Math.min(r1 - i, d1[j]);
    }

    while (
      i + k + 1 < n &&
      i - k - 1 >= 0 &&
      str[i + k + 1] === str[i - k - 1]
    ) {
      k++;
    }
    d1[i] = k;

    if (i + k > r1) {
      l1 = i - k;
      r1 = i + k;
    }
  }

  const d2 = new Array(n).fill(0);
  let l2 = 0;
  let r2 = -1;

  for (let i = 0; i < n; i++) {
    let k = 0;
    if (i <= r2) {
      const j = l2 + r2 - i + 1;
      k = Math.min(r2 - i + 1, d2[j]);
    }

    while (i + k < n && i - k - 1 >= 0 && str[i + k] === str[i - k - 1]) {
      k++;
    }
    d2[i] = k;

    if (i + k - 1 > r2) {
      l2 = i - k;
      r2 = i + k - 1;
    }
  }

  let maxLen = 0;
  let startPos = 0;
  for (let i = 0; i < n; i++) {
    const len = 2 * d1[i] + 1;
    if (len > maxLen) {
      maxLen = len;
      startPos = i - d1[i];
    }
  }

  for (let i = 0; i < n; i++) {
    const len = 2 * d2[i];
    if (len > maxLen) {
      maxLen = len;
      startPos = i - d2[i];
    }
  }
  return str.slice(startPos, startPos + maxLen);
}
export {findLongestPalindrome};
