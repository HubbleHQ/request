/**
 * A valid, non-error response.
 *
 * @memberof module:request
 */
class ValidResponse {
  /**
   * @param {Response} response - the `fetch` `Response` object
   * @param {Object|String} body - the body of the response
   */
  constructor(response, body) {
    this.internalBody = body;
    this.internalResponse = response;
  }

  /**
   * The content returned by the server. If the response has a `Content-Type` header of `application/json`, then `body` will be parsed into a JavaScript object. Otherwise, `body` will be a string representing the content returned by the server.
   * @type {Object|String}
   */
  get body() {
    return this.internalBody;
  }

  /**
   * The `fetch` `Response` object, which can be useful for low-level operations. Note that the body stream will be locked.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Response|Response}
   * @type {Response}
   */
  get response() {
    return this.internalResponse;
  }

  /**
   * The HTTP Status Code returned by the server (ie. 401, 404, 500, etc.)
   * @type {Number}
   */
  get statusCode() {
    return this.internalResponse.status;
  }
}

export default ValidResponse;
