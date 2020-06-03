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
   * @param {object} request - the request that was made with url etc.
   * @param  {...any} args - further arguments to pass to `Error`
   */
 constructor(exception, request, ...args) {
   super(...args);	    super(...args);


   this.internalRequest = request;
   this.internalException = exception;	    this.internalException = exception;
 }

 /**
  * The an object containing details of the request
  * that was made.
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

export default NetworkError;
