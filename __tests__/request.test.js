import HttpError from '../HttpError';
import request from '../request';
import NetworkError from '../NetworkError';

const url = 'http://www.example.com/some-endpoint';

describe('core : helpers : request : ', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should default to GET requests', async () => {
    fetch.mockResponse('sample response - value is irrelevant');
    expect(fetch).not.toHaveBeenCalled();

    await request(url);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        method: 'GET',
      }),
    );
  });

  it('should allow specifying other methods', async () => {
    fetch.mockResponse('sample response - value is irrelevant');
    expect(fetch).not.toHaveBeenCalled();

    await request(url, 'POST');

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });

  it("should convert the body to JSON if it's an object", async () => {
    fetch.mockResponse('sample response - value is irrelevant');
    expect(fetch).not.toHaveBeenCalled();

    const body = { key: 'some value', key2: 182 };

    await request(url, 'POST', body);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        body: JSON.stringify(body),
      }),
    );
  });

  it("should pass the body as-is if it's a string", async () => {
    fetch.mockResponse('sample response - value is irrelevant');
    expect(fetch).not.toHaveBeenCalled();

    const body = "Let's Go Raptors! #WeTheNorth";

    await request(url, 'POST', body);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        body,
      }),
    );
  });

  it('should set Content-Type to application/json when sending an object', async () => {
    fetch.mockResponse('sample response - value is irrelevant');
    expect(fetch).not.toHaveBeenCalled();

    const body = { key: 'some value', key2: 182 };

    await request(url, 'POST', body);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('should set Content-Type to text/plain when sending a string', async () => {
    fetch.mockResponse('sample response - value is irrelevant');
    expect(fetch).not.toHaveBeenCalled();

    const body = "Let's Go Raptors! #WeTheNorth";

    await request(url, 'POST', body);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'text/plain',
        }),
      }),
    );
  });

  it("should not overwrite Content-Type if it's explicitly specified, in object notation", async () => {
    fetch.mockResponse('sample response - value is irrelevant');
    expect(fetch).not.toHaveBeenCalled();

    const body = "Let's Go Raptors! #WeTheNorth";

    await request(url, 'POST', body, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'text/html',
        }),
      }),
    );
  });

  it('should convert the body to search params for GET requests', async () => {
    fetch.mockResponse('sample response - value is irrelevant');
    expect(fetch).not.toHaveBeenCalled();

    const body = { key: 'some value', key2: 182 };
    const expectedUrl = new URL(url);

    expectedUrl.searchParams.append('key', body.key);
    expectedUrl.searchParams.append('key2', body.key2);

    await request(url, 'GET', body);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expectedUrl.toString(),
      expect.objectContaining({
        method: 'GET',
      }),
    );
  });

  it('should append new search params to existing ones', async () => {
    fetch.mockResponse('sample response - value is irrelevant');
    expect(fetch).not.toHaveBeenCalled();

    const urlWithParams = `${url}?param=1`;
    const body = { key: 'some value', key2: 182 };
    const expectedUrl = new URL(urlWithParams);

    expectedUrl.searchParams.append('key', body.key);
    expectedUrl.searchParams.append('key2', body.key2);

    await request(urlWithParams, 'GET', body);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expectedUrl.toString(),
      expect.objectContaining({
        method: 'GET',
      }),
    );
  });

  it('should not contain a body if method is GET', async () => {
    fetch.mockResponse('sample response - value is irrelevant');
    expect(fetch).not.toHaveBeenCalled();

    const body = { limb: 'foo' };

    await request(url, 'GET', body);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.not.objectContaining({
        body,
      }),
    );
  });

  describe('non-error responses : ', () => {
    it('should turn a JSON response into a JavaScript object', async () => {
      const expectedResponse = {
        someKey: 'some value',
        anotherKey: 'some other value',
      };

      fetch.mockResponse(async () => {
        return {
          body: JSON.stringify(expectedResponse),
          init: {
            headers: new Headers({
              'Content-Type': 'application/json; charset=UTF-8',
            }),
          },
        };
      });

      return expect(request(url)).resolves.toHaveProperty(
        'body',
        expectedResponse,
      );
    });

    it('should turn an HTML response into a string', () => {
      const expectedResponse = "<!DOCTYPE html><div>I'm a teapot</div>";

      fetch.mockResponse(async () => {
        return {
          body: expectedResponse,
          init: {
            headers: new Headers({
              'Content-Type': 'text/html; charset=UTF-8',
            }),
          },
        };
      });

      return expect(request(url)).resolves.toHaveProperty(
        'body',
        expectedResponse,
      );
    });

    it('should include the fetch response', () => {
      const expectedResponse = {
        someKey: 'some value',
        anotherKey: 'some other value',
      };

      fetch.mockResponse(async () => {
        return {
          body: JSON.stringify(expectedResponse),
          init: {
            headers: new Headers({
              'Content-Type': 'application/json; charset=UTF-8',
            }),
          },
        };
      });

      // check for a property that exists on fetch responses
      return expect(request(url)).resolves.toHaveProperty('response.status');
    });

    it('should include the HTTP status code', () => {
      const expectedStatusCode = 203;

      const expectedResponse = {
        someKey: 'some value',
        anotherKey: 'some other value',
      };

      fetch.mockResponse(async () => {
        return {
          body: JSON.stringify(expectedResponse),
          init: {
            headers: new Headers({
              'Content-Type': 'application/json; charset=UTF-8',
            }),
            status: expectedStatusCode,
          },
        };
      });

      return expect(request(url)).resolves.toHaveProperty(
        'statusCode',
        expectedStatusCode,
      );
    });
  });

  describe('HTTP errors : ', () => {
    it('should turn a JSON response into a JavaScript object', () => {
      const expectedResponse = {
        someKey: 'some value',
        anotherKey: 'some other value',
      };

      fetch.mockResponse(async () => {
        return {
          body: JSON.stringify(expectedResponse),
          init: {
            headers: new Headers({
              'Content-Type': 'application/json; charset=UTF-8',
            }),
            status: 404,
          },
        };
      });

      return expect(request(url)).rejects.toHaveProperty(
        'body',
        expectedResponse,
      );
    });

    it('should turn an HTML response into a string', () => {
      const expectedResponse = "<!DOCTYPE html><div>I'm a teapot</div>";

      fetch.mockResponse(async () => {
        return {
          body: expectedResponse,
          init: {
            headers: new Headers({
              'Content-Type': 'text/html; charset=UTF-8',
            }),
            status: 500,
          },
        };
      });

      return expect(request(url)).rejects.toHaveProperty(
        'body',
        expectedResponse,
      );
    });

    it('should extract an error message from the response body', () => {
      const expectedResponse = {
        someKey: 'some value',
        anotherKey: 'some other value',
        error: 'I am an error message',
      };

      fetch.mockResponse(async () => {
        return {
          body: JSON.stringify(expectedResponse),
          init: {
            headers: new Headers({
              'Content-Type': 'application/json; charset=UTF-8',
            }),
            status: 404,
          },
        };
      });

      return expect(request(url)).rejects.toHaveProperty(
        'error',
        expectedResponse.error,
      );
    });

    it('should set the error message to null if no error message was set in the response body', () => {
      const expectedResponse = {
        someKey: 'some value',
        anotherKey: 'some other value',
      };

      fetch.mockResponse(async () => {
        return {
          body: JSON.stringify(expectedResponse),
          init: {
            headers: new Headers({
              'Content-Type': 'application/json; charset=UTF-8',
            }),
            status: 404,
          },
        };
      });

      return expect(request(url)).rejects.toHaveProperty('error', null);
    });

    it('should include the fetch response', () => {
      const expectedResponse = {
        someKey: 'some value',
        anotherKey: 'some other value',
      };

      fetch.mockResponse(async () => {
        return {
          body: JSON.stringify(expectedResponse),
          init: {
            headers: new Headers({
              'Content-Type': 'application/json; charset=UTF-8',
            }),
            status: 500,
          },
        };
      });

      // check for a property that exists on fetch responses
      return expect(request(url)).rejects.toHaveProperty('response.status');
    });

    it('should set the correct error type', () => {
      const expectedResponse = {
        someKey: 'some value',
        anotherKey: 'some other value',
      };

      fetch.mockResponse(async () => {
        return {
          body: JSON.stringify(expectedResponse),
          init: {
            headers: new Headers({
              'Content-Type': 'application/json; charset=UTF-8',
            }),
            status: 500,
          },
        };
      });

      // check for a property that exists on fetch responses
      return expect(request(url)).rejects.toBeInstanceOf(HttpError);
    });
  });

  describe('network errors : ', () => {
    const mockErrorObject = {
      message: "I'm a fake error object.",
    };

    beforeEach(() => {
      fetch.mockReject(mockErrorObject);
    });

    it('should include the exception', async () => {
      await expect(request(url)).rejects.toHaveProperty(
        'exception',
        mockErrorObject,
      );
    });

    it('should set the correct error type', async () => {
      await expect(request(url)).rejects.toBeInstanceOf(NetworkError);
    });
  });
});
