function rotateArray(arr, steps) {
  const len = arr.length;

  if (len === 0) {
    return arr;
  }

  return arr.slice(len - steps, len).concat(arr.slice(0, len - steps));
}

export {rotateArray};
