/**
 * A config of valid HTTP request methods with their meaning. Intended to be imported
 * and referenced in applications to avoid typo-ing request m ethods when written by
 * hand. For instance:
 *
 * import { methods } from '@hubble/request';
 *
 * await request('https://example.com', methods.GET);
 *
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 */

export default {
  // The CONNECT method establishes a tunnel to the server identified by the target resource.
  CONNECT: 'CONNECT',
  // The DELETE method deletes the specified resource.
  DELETE: 'DELETE',
  // The GET method requests a representation of the specified resource. Requests using GET should only retrieve data.
  GET: 'GET',
  // The HEAD method asks for a response identical to a GET request, but without the response body.
  HEAD: 'HEAD',
  // The OPTIONS method describes the communication options for the target resource.
  OPTIONS: 'OPTIONS',
  // The PATCH method applies partial modifications to a resource.
  PATCH: 'PATCH',
  // The POST method submits an entity to the specified resource, often causing a change in state or side effects on the server.
  POST: 'POST',
  // The PUT method replaces all current representations of the target resource with the request payload.
  PUT: 'PUT',
  // The TRACE method performs a message loop-back test along the path to the target resource.
  TRACE: 'TRACE',
};
