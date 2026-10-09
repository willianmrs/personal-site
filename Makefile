.PHONY: install instlal build run preview check test

PORT ?= 5173

install:
	npm ci

# Alias for the spelling used in the original request.
instlal: install

build:
	npm run build

run:
	npm run dev -- --port $(PORT)

preview:
	npm run preview -- --port $(PORT)

check:
	npm run typecheck

test: build
	npm test
