export function mergeArrays(arr1, arr2) {
  const result = [];

  for (const array of [arr1, arr2]) {
    for (const item of array) {
      let found = false;

      for (const savedItem of result) {
        if (
          item === savedItem ||
          (Number.isNaN(item) && Number.isNaN(savedItem))
        ) {
          found = true;
          break;
        }
      }

      if (!found) {
        result.push(item);
      }
    }
  }

  return result;
}
