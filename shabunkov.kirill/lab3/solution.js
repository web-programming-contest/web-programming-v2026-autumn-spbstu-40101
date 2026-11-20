export function maxSlidingWindow(arr, k) {
  if (!Number.isInteger(k) || k <= 0 || k > arr.length) {
    return [];
  }

  const result = [];
  const deque = [];
  let head = 0;

  for (let index = 0; index < arr.length; index += 1) {
    while (head < deque.length && deque[head] <= index - k) {
      head += 1;
    }

    while (head < deque.length && arr[deque[deque.length - 1]] <= arr[index]) {
      deque.pop();
    }

    deque.push(index);

    if (index >= k - 1) {
      result.push(arr[deque[head]]);
    }
  }

  return result;
}
