all: test run

run:
	npm start

test: test-unit test-acceptance

test-unit:
	npm test

test-acceptance:
	python2.7 guitests.py

setup:
	npm install

build:
	npm run build
