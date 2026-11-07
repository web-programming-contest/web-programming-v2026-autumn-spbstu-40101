export function findMaxSubarraySum(arr, n) {
  if (arr === null) {
    return -1;
  }

  let res = -Infinity;
  let i = 0;

  while (arr.length >= i + n) {
    let temp = 0;
    for (let j = i; j < i + n; ++j) {
      temp += arr[j];
    }
    if (temp > res) {
      res = temp;
    }
    ++i;
  }

  return res;
}
