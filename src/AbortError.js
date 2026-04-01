/**
 * An error resulting from a request being aborted via `request().abort()`.
 * @memberof module:request
 */
class AbortError extends Error {
  /**
   * @param {Error} exception - the original AbortError thrown by fetch
   * @param {object} request - the request url along with any options passed along
   * @param  {...any} args - further arguments to pass to `Error`
   */
  constructor(exception, request, ...args) {
    super(...args);

    this.internalRequest = request;
    this.internalException = exception;
  }

  /**
   * Information about the aborted request, like the URL and headers
   * @type {object}
   */
  get request() {
    return this.internalRequest;
  }

  /**
   * The original exception that was thrown.
   * @type {Error}
   */
  get exception() {
    return this.internalException;
  }
}

export default AbortError;
