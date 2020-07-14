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
   * @param {object} request - the request url along with any options passed along
   * @param  {...any} args - further arguments to pass to `Error`
   */
  constructor(exception, request, ...args) {
    super(...args);

    this.internalRequest = request;
    this.internalException = exception;
  }

  /**
   * Information about the failing request, like the URL and headers
   * @type {object}
   */
  get request() {
    return this.internalRequest;
  }

  /**
   * Get an "extra" object: a JSON-encodeable object that can be sent to Sentry
   *
   * @type {Object}
   */
  get extra() {
    return {
      ...this.request,
    };
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
