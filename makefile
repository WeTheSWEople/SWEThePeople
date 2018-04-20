
GithubID = WeTheSWEople
RepoName = SWEThePeople
SHA = dafe99600f182a7e3be4ad2b094b4cae793a5ea6

githubid:
	@echo "${GithubID}"

reponame:
	@echo "${RepoName}"

sha:
	@echo "${SHA}"


# make github   - prints link to github repo
github:
	@echo "http://www.github.com/${GithubID}/${RepoName}"

# make issues   - prints link to current phase's issues
issues:
	@echo "http://www.github.com/${GithubID}/${RepoName}/issues"

# make stories  - prints link to current phase's stories
stories:
	@echo "https://github.com/WeTheSWEople/SWEThePeople/labels?utf8=%E2%9C%93&q=story"

# make uml      - prints link to uml diagram
uml:
	@echo "http://www.github.com/${GithubID}/${RepoName}/blob/${SHA}/UML/models.png"
	
# make selenium - runs selenium tests
# You will need Firefox installed along with gecko driver in order to run selenium test
selenium:
	- cd frontend &&  pip2.7 install -r requirements.txt
	cd frontend && python2.7 guitests.py

# make frontend - runs frontend tests
frontend:
	cd frontend && npm install
	cd frontend && npm test

# make backend  - runs backend tests
# You will need to export environment variables (db credentials) to run backend target - provided in the turn in JSON
backend:
	@echo "Make sure to export environment variables"
	- cd backend && pip2.7 install -r requirements.txt
	cd backend && python tests.py

# make postman - runs postman tests
postman:
	- npm install -g newman
	newman run Postman.json

# make website  - prints link to a website
website:
	@echo "http://www.swethepeople.me/"

# make report   - prints link to technical report
report:
	@echo "https://wethesweople.gitbooks.io/report/"

# make apidoc   - prints link to api documentation
apidoc:
	@echo "https://wethesweople.gitbooks.io/api/"

# make self     - prints link to self critique
self:
	@echo "https://wethesweople.gitbooks.io/report/self-critique.html"

# make other    - prints link to other critique
other:
	@echo "https://wethesweople.gitbooks.io/report/other-critique.html"

# setup 
setup:
	cd frontend && make setup
	cd backend && make setup
	npm install -g newman

