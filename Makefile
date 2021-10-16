.PHONY: dev
dev:
	node test/index.js

.PHONY: publish
publish:
	npm publish
