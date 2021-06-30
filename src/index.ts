type HandlerFunction<T> = () => T;
type Handler<T> = [number, HandlerFunction<T>];
type Handlers<T> = Array<Handler<T>>;

/**
 * Randomly invokes a handler based on the provided fractional call rates. Has a much cleaner
 * recursive implementation in a purely functional language where we'd recurse through a linked list
 * ;).
 *
 * Example:
 *
 * ```js
 * // Randomly invoke one of following arrow functions based on the given fraction.
 * // e.g. it'll invoke the first function ~10% of the time if called repeatedly.
 * invokeFraction([
 *   [0.1, () => console.log('10%')],
 *   [0.3, () => console.log('30%')],
 *   // The number here doesn't matter, provided it's >0, as it's the last partition.
 *   [0.6, () => console.log('60%')],
 * ]);
 * ```
 *
 * The `invokeFraction` function also supports a `defaultHandler` parameter, which stands in for the
 * last item of the handlers array. Note that this is the recommended way to avoid letting the last
 * item in the handlers array be invoked for the remaining partition, rather than the defined
 * fraction.
 *
 * ```js
 * invokeFraction([
 *   [0.1, () => console.log('10%')],
 *   [0.3, () => console.log('30%')],
 * ], () => console.log('60%'));
 * ```
 *
 * @param {Handlers<T>} handlers The handlers to invoke. Can be empty, in which case the
 *   defaultHandler will be invoked. A fraction of 0 disables the handler, where it will not be
 *   called.
 * @param {HandlerFunction<T>} defaultHandler The default handler to invoke, if none of the handlers
 *   were invoked.
 * @return {T} The result of calling the randomly selected partition.
 * @throws {TypeError} If the no handler is enabled, and no default handler is provided.
 */
function partitionFraction<T>(
  handlers: Handlers<T>,
  defaultHandler: HandlerFunction<T> | null | undefined = null
): T {
  let key = Math.random(),
    lastValid = null;

  for (const [fraction, handler] of handlers) {
    // Disabled.
    if (!fraction) continue;

    if (key < fraction) {
      return handler();
    } else {
      key -= fraction;
      lastValid = handler;
    }
  }

  if (defaultHandler) {
    return defaultHandler();
  }

  // Bad arithmetic :)
  if (lastValid) {
    return lastValid();
  }

  throw new TypeError('received no enabled handlers');
}

export default partitionFraction;
