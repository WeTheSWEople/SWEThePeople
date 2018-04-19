setup:
	cd frontend && make setup
	cd backend && make setup
	npm install -g newman
issues:
	@echo "https://github.com/WeTheSWEople/SWEThePeople/issues"

github:
	@echo "https://github.com/WeTheSWEople/SWEThePeople"

uml:
	@echo "https://raw.githubusercontent.com/WeTheSWEople/SWEThePeople/master/UML/models.png"
	
stories:
	@echo "https://github.com/WeTheSWEople/SWEThePeople/labels?utf8=%E2%9C%93&q=story"

selenium:
	- cd frontend && virtualenv venv && source venv/bin/activate &&  pip2.7 install -r requirements.txt
	cd frontend && python2.7 guitests.py

mocha:
	cd frontend && npm install
	cd frontend && npm test

# (You will need to export environment variables (db credentials) to run backend target - provided in the turn in JSON)
backend:
	- cd backend && virtualenv venv && source venv/bin/activate && pip2.7 install -r requirements.txt
	cd backend && python tests.py

postman:
	- npm install -g newman
	newman run Postman.json

website:
	@echo "http://www.swethepeople.me/"

report:
	@echo "https://wethesweople.gitbooks.io/report/"

apidoc:
	@echo "https://wethesweople.gitbooks.io/api/"

self:
	@echo "https://wethesweople.gitbooks.io/report/self-critique.html"

other:
	@echo "https://wethesweople.gitbooks.io/report/other-critique.html"
