/**
 * An error, resulting from a network error. This means that we weren't able to
 * reach the server - the network connection might be unavailable, or the
 * service might be down.
 *
 * @memberof module:request
 */
class NetworkError extends Error {
  /**
   * @param {Error} exception - the original error
   * @param  {...any} args - further arguments to pass to `Error`
   */
  constructor(exception, ...args) {
    super(...args);

    this.internalException = exception;
  }

  /**
   * The original exception that was thrown.
   * @type {Error}
   */
  get exception() {
    return this.internalException;
  }
}

export default NetworkError;
