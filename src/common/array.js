function first(array) {
  const length = Array.isArray(array) ? array.length : 0;
  return length ? array[0] : undefined;
}

function last(array) {
  const length = Array.isArray(array) ? array.length : 0;
  return length ? array[length - 1] : undefined;
}

function get(array, index) {
  const length = Array.isArray(array) ? array.length : 0;
  const idx = index >= 0 ? index : length - index - 1;
  return length ? array[idx] : undefined;
}

export default { first, last, get };
