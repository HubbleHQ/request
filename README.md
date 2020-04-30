# `@hubble/request`

A simple, universal, no-frills networking library

## Installing

Install with:

```shell
npm install @hubble/request
```

Or, with yarn:

```shell
yarn add @hubble/request
```

## Development

### Prerequisites

- [`docker`](https://www.docker.com/)
- [`docker-compose`](https://docs.docker.com/compose/)
- `make`

### Setup

Run:

```shell
make dev-setup dev-build
```

### Development

To rebuild the contents of `dist` every time you change a file in `src`, use:

```shell
make dev-run
```

### Tests

You can run the tests, _while running `make dev-run`_, using:

```shell
make dev-test
```

You can re-run the tests every time you save a file using:

```shell
make dev-test-watch
```

### Getting local `node_modules`

In order to have your code editor use `node_modules` to power its plugins (such as `prettier` and `eslint`), you'll need to export your node modules:

```shell
make dev-export-node-modules
```

### Docs

We generate docs from JSDoc blocks on all our React code.

To view the docs locally, run

```sh
make dev-docs
```

This will generate the docs. You can view them at http://localhost:9004

### Publishing

To publish:

1. In one terminal tab, run `make dev-run`
2. Open a new tab. Run `make dev-ssh`
3. Bump the version, using `yarn version`
4. Push the update, and the tag, to the git repository: `git push && git push --tags`
5. Log in to npm, using an account authorized to push to the `@hubble` namespace: `yarn login`
5. Publish to npm: `yarn publish`
