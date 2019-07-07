/**
 * Test if a value is a counting number, 1 -> MAX_SAFE_INTEGER.
 *
 * @param {*} value - The value to be tested.
 * @returns {boolean} True if value is a counting number.
 */
export default function isCountingNumber(value) {
  /* eslint-disable-next-line compat/compat */
  return Number.isSafeInteger(value) && value > 0;
}
