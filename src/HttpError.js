/**
 * An error, resulting from an error-level (4xx, 5xx) HTTP status code from the
 * server.
 * @memberof module:request
 */
class HttpError extends Error {
  /**
   * @param {Response} response - the `fetch` `Response` object
   * @param {Object|String} body - the body of the response
   * @param  {...any} args - further arguments to pass to `Error`
   */
  constructor(response, body, ...args) {
    super(...args);

    this.internalBody = body;
    this.internalResponse = response;
  }

  /**
   * The content returned by the server. If the response has a `Content-Type`
   * header of `application/json`, then `body` will be parsed into a JavaScript
   * object. Otherwise, `body` will be a string representing the content
   * returned by the server.
   *
   * @type {Object|String}
   */
  get body() {
    return this.internalBody;
  }

  /**
   * An error message returned by the server. For convenience, `error` will be
   * the value of `body.error`, or `null` if `body.error` is falsy.
   *
   * @type {String|null}
   */
  get error() {
    return this.internalBody.error || null;
  }

  /**
   * Get an "extra" object: a JSON-encodeable object that can be sent to Sentry
   *
   * @type {Object}
   */
  get extra() {
    return {
      body: this.body,
      response: this.response,
      statusCode: this.statusCode,
    };
  }

  /**
   * The `fetch` `Response` object, which can be useful for low-level
   * operations. Note that the body stream will be locked.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Response}
   * @type {Response}
   */
  get response() {
    return this.internalResponse;
  }

  /**
   * The HTTP Status Code returned by the server (ie. 401, 404, 500, etc.)
   *
   * @type {Number}
   */
  get statusCode() {
    return this.internalResponse.status;
  }
}

export default HttpError;
