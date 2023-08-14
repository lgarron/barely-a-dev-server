.PHONY: dev
dev:
	node test/index.js

.PHONY: test
test: test-build test-budget

.PHONY: test-build
test-build:
	node test/build.js

.PHONY: test-budget
test-budget:
	script/test-budget.bash

.PHONY: lint
lint:
	npx rome check src

.PHONY: format
format:
	npx rome format --write src

.PHONY: publish
publish: test
	npm publish

.PHONY: clean
clean:
	rm -rf ./.temp ./dist
