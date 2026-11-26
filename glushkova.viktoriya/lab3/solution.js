export function findMedian(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return null;
  }

  const sorted = [...arr].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 !== 0) {
    return sorted[middle];
  }

  return (sorted[middle - 1] + sorted[middle]) / 2;
}
