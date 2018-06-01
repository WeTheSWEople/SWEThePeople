# swethepeople.me

An IDB project for CS 373: Software Engineering that brings together data on
American political parties, representatives, and congressional districts.

- Website: [swethepeople.me](http://www.swethepeople.me)
- API: [api.swethepeople.me](http://www.api.swethepeople.me)
- Technical report: [https://wethesweople.gitbooks.io/report/](https://wethesweople.gitbooks.io/report/)
- Python Version: Python2.7

## Walkthrough
### Splash Page
![Splash Page](/images/screenshots/splash.png)
### Representatives
#### Grid
![Representatives Grid](/images/screenshots/rep_grid.png)
#### Details
![Representatives Details](/images/screenshots/rep_details.png)
### Parties
![Parties Grid](/images/screenshots/parties_grid.png)
### Districts
#### Grid
![Districts Grid](/images/screenshots/districts_grid.png)
#### Details
![Districts Details](/images/screenshots/districts_details.png)

## Install Repo Locally
1. Clone the repository
```
$ https://github.com/WeTheSWEople/SWEThePeople.git
```

2. Install frontend dependencies
```
$ cd frontend
$ npm install
```

3. Install backend dependencies
```
$ cd backend
$ virtualenv venv
$ source venv/bin/activate
$ pip2.7 install -r requirements.txt
```

## Running the Site Locally
### Server
Run the server locally using:
```
$ cd frontend
$ npm start
```

Then, access the local site by visiting `localhost:3000`

### API
Run the API locally using:
```
$ cd backend
$ virtualenv venv
$ source venv/bin/activate
$ pip2.7 install -r requirements.txt
$ export PYTHONPATH=.:$PYTHONPATH
$ python2.7 main.py
```

Then, access the local API by visiting `0.0.0.0:4040`

## Running Tests
### Frontend Unit Tests
In the frontend folder, run the test script (located at `frontend/tests.js`)
```
$ cd frontend
$ npm test
```

### Frontend Acceptance Tests
Frontend acceptance tests run using the Selenium web driver.
1. Install [Firefox](https://www.mozilla.org/en-US/firefox/new/)
2. Install [geckodriver](https://github.com/mozilla/geckodriver)
(should install to `/user/local/bin/`)
3. cd into frontend folder
```
$ cd frontend
```
4. Create Virtual Environment and Install Requirements:
```
$ virtualenv venv
$ source venv/bin/activate
$ pip install -r requirements.txt
```
5. Run the test script
```
$ python2.7 guitests.py
```

### Backend tests
In the backend folder, run the test script
(You will need to export environment variables (db credentials) to run this test - provided in the turn in JSON)
```
$ cd backend
$ virtualenv venv
$ source venv/bin/activate
$ pip2.7 install -r requirements.txt
$ export PYTHONPATH=.:$PYTHONPATH
$ python2.7 tests.py
```

### Postman tests
Ensure newman is installed, then run the tests in the repo's base directory
```
$ npm install -g newman
$ newman run Postman.json
```

## Running the Scrapers
The scrapers will store information in the database defined in `config.json`. The scrapers **must** be run in the order below to ensure that the data is stored properly.

From the backend folder:
```
$ cd backend
```

1. Run the political parties seeder
```
$ virtualenv venv
$ source venv/bin/activate
$ pip2.7 install -r requirements.txt
$ export PYTHONPATH=.:$PYTHONPATH
$ python2.7 party_seed.py
```

2. Run the representative scraper
```
$ virtualenv venv
$ source venv/bin/activate
$ pip2.7 install -r requirements.txt
$ export PYTHONPATH=.:$PYTHONPATH
$ python2.7 representatives_scraper.py
```

3. Run the congressional districts scraper
```
$ virtualenv venv
$ source venv/bin/activate
$ pip2.7 install -r requirements.txt
$ export PYTHONPATH=.:$PYTHONPATH
$ python2.7 districts_scraper.py
```

## Setting up PgAdmin for Postgres
[Download PgAdmin 4](https://www.pgadmin.org/download/)

### Creating a new server
1. Right click on servers -> create server
2. Fill in the name as `swethepeople`
3. Fill in the `host name/address` under the connection tab.
4. Save

### Connect to the server
1. Right click and connect to the server
2. Fill in the username and password

### Accessing tables
1. Expand the server tab
2. Go to Databases -> swethepeople -> Schemas -> Tables

## EC2 Setup
1. SSH into the EC2 instance
2. Clone the repository
```
$ https://github.com/WeTheSWEople/SWEThePeople.git`
```
3. Install dependencies
```
$ virtualenv venv
$ source venv/bin/activate
$ pip2.7 install -r requirements.txt
$ export PYTHONPATH=.:$PYTHONPATH
$ npm install
```
4. Build the project
```
$ cd frontend
$ npm run build
```
5. You have a choice here. You can either run using Gunicorn via
```
$ cd ..
$ gunicorn router:app -b localhost:8000
```
or with flask itself via
```
$ cd ..
$ python router.py &
```
