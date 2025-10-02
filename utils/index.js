// src/utils/index.js

/**
 * Debounces a function call.
 * @param {Function} func The function to debounce.
 * @param {number} delay The delay in milliseconds.
 * @returns {Function} The debounced function.
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    // Clear the previous timeout
    clearTimeout(timeoutId);

    // Set a new timeout
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

/**
 * Throttles a function call.
 * @param {Function} func The function to throttle.
 * @param {number} limit The time limit in milliseconds.
 * @returns {Function} The throttled function.
 */
export const throttle = (func, limit) => {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall < limit) {
      return;
    }
    lastCall = now;
    func.apply(this, args);
  };
};
