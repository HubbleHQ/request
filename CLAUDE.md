# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn build          # Transpile src/ to dist/ with Babel
yarn test           # Run Jest test suite
yarn test -t "name" # Run a single test by name pattern
yarn test --watch   # Run tests in watch mode
yarn lint           # Run ESLint + Prettier format check
yarn format         # Auto-format src/ with Prettier
```

Docker-based dev environment (requires Docker + make):
```bash
make dev-setup dev-build   # Initial setup
make dev-test              # Run tests in Docker
make dev-test-watch        # Watch-mode tests in Docker
```

## Architecture

`@hubble/request` is a lightweight, universal HTTP client wrapping the Fetch API. It targets both Node and browser environments via `isomorphic-unfetch`.

**Request flow:**
1. `src/request.js` — core function; encodes the request body (JSON-stringifies objects, converts GET body to query params), calls `fetch`, then parses the response based on `Content-Type`
2. On non-2xx status → throws `HttpError` (with body, statusCode, response, extra)
3. On network failure → throws `NetworkError` (with request, exception, extra)
4. On abort → throws `AbortError` (with request, exception)
5. On success → returns `ValidResponse` (with body, statusCode, response)

**Exports (`src/index.js`):** `request` (default), `AbortError`, `HttpError`, `NetworkError`, `ValidResponse`, `httpMethods`, `httpStatuses`

**Error distinction:** `HttpError` = server responded with 4xx/5xx. `NetworkError` = no response (DNS failure, timeout, etc.). `AbortError` = request cancelled via `request().abort()`.

**Aborting requests:** `request()` returns a promise with an `abort()` method. Calling it cancels the underlying fetch via an internal `AbortController` and rejects the promise with `AbortError`.
