export function rotateArray(arr, steps) {
  const shift = steps % arr.length;

  if (shift === 0) {
    return [...arr];
  }

  const rightPart = arr.slice(-shift);
  const leftPart = arr.slice(0, arr.length - shift);

  return [...rightPart, ...leftPart];
}
