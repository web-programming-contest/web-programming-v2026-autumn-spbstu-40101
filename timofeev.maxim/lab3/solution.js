export function removeDuplicates(arr) {
  const seen = {};
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];
    const key = `${typeof value}:${value}`;
    if (!seen[key]) {
      seen[key] = true;
      result.push(value);
    }
  }

  return result;
}
