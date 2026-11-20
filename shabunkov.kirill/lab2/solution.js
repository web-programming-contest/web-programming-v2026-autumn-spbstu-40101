export function zipArrays(...arrays) {
  if (arrays.length === 0) {
    return [];
  }

  const shortestLength = Math.min(...arrays.map((array) => array.length));
  const result = [];

  for (let index = 0; index < shortestLength; index += 1) {
    result.push(arrays.map((array) => array[index]));
  }

  return result;
}
