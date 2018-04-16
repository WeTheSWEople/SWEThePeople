setup:
	cd frontend && make setup
	cd backend && make setup
	npm install -g newman
issues:
	@echo "https://github.com/WeTheSWEople/SWEThePeople/issues"

github:
	@echo "https://github.com/WeTheSWEople/SWEThePeople"

stories:
	@echo "https://github.com/WeTheSWEople/SWEThePeople/labels?utf8=%E2%9C%93&q=story"

selenium:
	- cd frontend && pip2.7 install -r requirements.txt
	cd frontend && python2.7 guitests.py

mocha:
	cd frontend && npm install && npm test

backend:
	- cd backend && pip2.7 install -r requirements.txt
	cd backend && python2.7 tests.py

postman:
	- npm install -g newman
	newman run Postman.json

website:
	@echo "http://www.swethepeople.me/"

report:
	@echo "https://wethesweople.gitbooks.io/report/"

apidoc:
	@echo "https://wethesweople.gitbooks.io/api/"
