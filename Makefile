export PROJECT_NAME := $(shell echo "$${PWD\#\#*/}")
export COMPOSE_HTTP_TIMEOUT := 120

PACKAGE_MANAGER := yarn

.PHONY: dev-all
dev-all: dev-setup dev-build dev-run ## Set everything up and start project. You need to install heroku-docker (https://github.com/HubbleHQ/heroku-docker) for this to work

.PHONY: dev-build
dev-build: ## Create the docker image for your dev environment.
	time docker compose --profile dev build

.PHONY: prod-build
prod-build: ## Create the docker image for your production environment.
	time docker compose --profile production build

.PHONY: dev-update-lockfile
dev-update-lockfile: ## update the yarn lockfile to add any new dependencies
	build-scripts/runner yarn

.PHONY: dev-run
dev-run: ## Run a local instance of request
	docker compose --profile dev up --build --remove-orphans

.PHONY: dev-run-production
dev-run-production: ## Run a local instance of request, built like it would be in production
	docker compose --profile production up --build --remove-orphans

.PHONY: dev-stop ## Shutdown the running container and remove any intermediate images. Usfull for when you think the container is stopped but docker doesn’t
dev-stop:
	docker compose --profile dev down --remove-orphans
	docker compose --profile production down --remove-orphans

.PHONY: dev-clean
dev-clean: ## Remove all the docker containers for this project
	docker compose --profile dev down --rmi local --volumes
	docker compose --profile production down --rmi local --volumes

.PHONY: dev-setup ## Get the env vars from Heroku, you need to install heroku-docker (https://github.com/HubbleHQ/heroku-docker) for this to work.
dev-setup:
	build-scripts/git-hooks

.PHONY: dev-ssh
dev-ssh: ## Open a shell on the current running docker image of the project
	docker compose exec dev sh

.PHONY: dev-shell
dev-shell: ## Creates a shell in the project container, does not connect to a running instance. Use dev-ssh for that.
	docker compose run --rm dev sh

.PHONY: dev-test
dev-test: ## Run all the tests
	time build-scripts/runner dev test

.PHONY: dev-test-coverage
dev-test-coverage: ## Run all the tests, and generate a coverage report
	time build-scripts/runner dev test --coverage

.PHONY: dev-test-watch
dev-test-watch: ## Start Jest in watch mode (and generate coverage reports)
	build-scripts/runner dev test --watch --coverage --changedSince=master

.PHONY: dev-lint
dev-lint: ## Run the linter on staged files
	build-scripts/runner dev lint

.PHONY: dev-snapshots
dev-snapshots: ## Build the snapshots for the snapshot tests
	build-scripts/runner dev test -u ${SNAP}

.PHONY: dev-docs
dev-docs: ## Run jsdoc
	build-scripts/runner yarn docs:build
	build-scripts/runner yarn docs:start -p 9004

.PHONY: dev-export-node-modules
dev-export-node-modules: ## Export the node modules so eslint and command compleation still works.
	time build-scripts/export-node-modules

.PHONY: help
help: ## This message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help