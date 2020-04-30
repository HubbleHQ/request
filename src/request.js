import 'isomorphic-unfetch';

import HttpError from './HttpError';
import NetworkError from './NetworkError';
import ValidResponse from './ValidResponse';

/**
 * @module request
 */

/**
 * Gets the body of a response. If the response has a `Content-Type` header set to `application/json`, it will parse the body as JSON and return the result.
 *
 * NOTE: running this function will lock the response body. It will be impossible to re-read the response. **It should only ever be run on a `Response` object one time.**
 *
 * @param {Response} response a `fetch` `Response` object
 * @memberof module:request
 * @private
 */
const getBody = async (response) => {
  const contentType = response.headers.get('Content-Type');

  let body;
  if (contentType && contentType.includes('application/json')) {
    body = await response.json();
  } else {
    body = await response.text();
  }

  return body;
};

/**
 * Derives a url string to use in `fetch`
 *
 * @param {String} urlArg - the url
 * @param {String} method - the method to use (GET, POST, etc.)
 * @param {Object|String} body - the content to send
 * @private
 */
const getUrl = (urlArg, method, body = {}) => {
  const url = new URL(urlArg);

  if (method.toLowerCase() === 'get') {
    Object.entries(body).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  return url.toString();
};

/**
 * Creates an error object from the response.
 *
 * @param {Response} response a `fetch` `Response` object
 * @return {module:request.HttpError} the error object derived from the `response`.
 * @memberof module:request
 * @private
 */
const createError = async (response) => {
  const body = await getBody(response);

  return new HttpError(
    response,
    body,
    'The server responded with an HTTP error code.',
  );
};

/**
 * Creates a response object with the following keys:
 *
 * @param {Response} response a `fetch` `Response` object
 * @return {module:request.ValidResponse}
 * @memberof module:request
 * @private
 */
const createResponse = async (response) => {
  const body = await getBody(response);

  return new ValidResponse(response, body);
};

/**
 * Derives an options object to use on `fetch`, given its parameters. Handles things like `Content-Type` headers, methods, and body encoding.
 *
 * @param {String} method - the method to use (GET, POST, etc.)
 * @param {Object|String} body - the content to send
 * @param {Object} opts - the default options to use
 * @private
 */
const getOptions = (method, body, opts) => {
  const sendableOptions = { headers: {}, method, ...opts };

  if (typeof body === 'undefined' || method.toLowerCase() === 'get') {
    return sendableOptions;
  }

  const isJson = typeof body !== 'string';
  const contentType = isJson ? 'application/json' : 'text/plain';

  sendableOptions.body = isJson ? JSON.stringify(body) : body;

  if (!sendableOptions.headers['Content-Type']) {
    sendableOptions.headers['Content-Type'] = contentType;
  }

  return sendableOptions;
};

/**
 * Make a request to a URL.
 *
 * @param {string} url the URL to send a request to.
 * @param {String} [method="GET"] the HTTP method to use (GET, POST, PUT, DELETE)
 * @param {Object|String} [body=undefined] the content of the body of the request. If it's an object, will automatically apply `JSON.stringify`; otherwise, will send it as a string. Use `undefined` to specify no message body.
 * @param {*} [opts={}] `fetch` options. See `fetch()` init param: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
 * @throws {module:request.HttpError}
 *
 * If the response contains an HTTP Status Code in the error range (4xx or 5xx), then `request()` will throw an `HttpError`. This can be useful to detect, for example, a `401 Unauthorized`, a `404 Not Found`, a `500 Internal Server Error`, or any other HTTP status code.
 *
 * This error type can be detected by checking if `error instanceof HttpError`.
 * @throws {module:request.NetworkError}
 *
 * In the event of a network error, a `NetworkError` will throw. This can happen if:
 * - the user disconnects from their WiFi network
 * - the servers are down
 * - the request times out
 *
 * In the real world, this can happen if a user travels through a tunnel, disconnecting them from their mobile network. It's an important edge case to account for.
 *
 * This error type can be detected by checking if `error instanceof NetworkError`.
 * @return {Promise<module:request.ValidResponse>} a promise, resolving to a valid, non-error response object.
 * @memberof module:request
 */
const request = async (urlArg, method = 'GET', body = undefined, opts = {}) => {
  const sendableOptions = getOptions(method, body, opts);
  const url = getUrl(urlArg, method, body);

  let response;
  try {
    response = await fetch(url, sendableOptions);
  } catch (error) {
    throw new NetworkError(
      error,
      'A network error occurred. The network connection may have been disconnected, or the service may be down.',
    );
  }

  if (!response.ok) {
    throw await createError(response);
  }

  return createResponse(response);
};

export default request;
