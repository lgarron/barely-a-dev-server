.PHONY: dev
dev: setup
	node test/index.js

.PHONY: setup
setup:
	bun install --frozen-lockfile

.PHONY: test
test: test-build test-budget

.PHONY: test-build
test-build: setup
	node test/build.js

.PHONY: test-budget
test-budget: setup
	script/test-budget.bash

.PHONY: lint
lint: setup
	npx @biomejs/biome check src

.PHONY: format
format: setup
	npx @biomejs/biome format --write src

.PHONY: publish
publish:
	npm publish

.PHONY: prepublishOnly
prepublishOnly: test

.PHONY: clean
clean:
	rm -rf ./dist

.PHONY: reset
reset: clean
	rm -rf ./node_modules
