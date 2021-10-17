.PHONY: dev
dev:
	node test/index.js

.PHONY: test-build
test-build:
	node test/build.js

.PHONY: publish
publish:
	npm publish
