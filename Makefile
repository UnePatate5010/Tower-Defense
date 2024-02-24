all: run

build:
	npx tsc -p tsconfig.json


parcel:
	npx parcel src/index.html

run: build
	node --experimental-specifier-resolution=node ./dist/game.js

test:
	npx jest tst/*.ts

test_coverage:
	npx jest --coverage

eslint:
	npx eslint src tst


clean:
	@rm -f *~
	@rm -f src/*.js
	@rm -f dist/*.js
	@rm -f dist/*
