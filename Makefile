.PHONY: test
test:
	node test/index.js

.PHONY: publish
publish:
	npm publish
