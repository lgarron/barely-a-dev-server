.PHONY: dev
dev: setup
	node test/index.js

.PHONY: check
check: test lint

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
	bun x -- bun-dx --package @biomejs/biome biome -- check

.PHONY: format
format: setup
	bun x -- bun-dx --package @biomejs/biome biome -- check --write

.PHONY: publish
publish:
	npm publish

.PHONY: prepublishOnly
prepublishOnly: test

RM_RF = bun -e 'process.argv.slice(1).map(p => process.getBuiltinModule("node:fs").rmSync(p, {recursive: true, force: true, maxRetries: 5}))' --

.PHONY: clean
clean:
	${RM_RF} ./dist/

.PHONY: reset
reset: clean
	${RM_RF} ./node_modules/
