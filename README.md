# WE THE SWEEPLE
Iteration 1.0 of our flask/react stack.

## Local Setup
Clone the repo
Go to the idb folder `cd idb`

### Frontend Setup
Setup the frontend

Go to the frontend folder
`cd idb`

Run `npm install` to install dependencies

Run `npm run build` to bundle and build the static assets for the flask server

Proceed to server setup below

### Server Setup
To run a virtual environment:
Create virtual environment
```
virtualenv venv
```

Activate the virtual environment
```
source venv/bin/activate
```

Install requirements in the virtual environment
```
pip install -r requirements.txt
```

Setup PYTHONPATH
```
export PYTHONPATH=.:$PYTHONPATH
```

Run the server
```
python router.py
```

Visit 127.0.0.1:5000 for the starter site


## EC2 Setup:
Make sure you are in your ec2 instance. You can access it via ssh.

1. Clone the repo
2. Make sure the build folder is up to date with the most recent builds
3. Run `pip install -r requirements.txt`
4. You have a choice here. You can either run this app using Gunicorn via `gunicorn router:app -b localhost:8000 & -D` or with flask itself `python router.py &`
5. Go to your public DNS and add a :5000 and watch your website go live!




## Collecting Data:
How to run the scraper files:
1. cd into the app folder

```
cd app/

```

2. Create virtual environment and install modules

```
virtualenv venv
```

```
source venv/bin/activate
```

```
pip install -r requirements.txt
```

```
export PYTHONPATH=.:$PYTHONPATH
```

3. Go to the main directory and run the scraper file:

```
python districts_scraper.py
```

## Running the API Locally:
1. cd into the app folder
2. Create virtual environment (same step as above)
3. Run the main python file

```
python main.py
```
4. Visit the api at http://0.0.0.0:4040/representative/A000374

## Setting up PgAdmin for Postgress:

**Download PgAdmin 4 from here:** https://www.pgadmin.org/download/

**Create a new server**
- Right click on servers -> create server
- Fill in the name as "swethepeople"
- Fill in the "host name/address" under the connection tab (look for host address in slack)
- Save

**Connect to the server**
- Right click and connect to the server
- Fill in the username and password

**Accesing Tables**
- Expand the server tab
- Go to Databases -> Swethepeople -> Schemas -> Tables

## Testing

### Frontend unit tests
1. cd into the idb folder
2. run the test script
```
npm test
```
- Test script is at
```
idb/test/tests.js
```

### Frontend acceptance tests (Selenium)
1. Have firefox installed, along with geckodriver
2. cd into idb folder
3. create virtual environment in idb folder (same as above)
3. run the test script
```
python test/guitests.py
```


### Backend tests
```
pip install -r app/requirements.txt
```

```
pip install -r requirements.txt
```

```
python app/main.py &
```

```
python router.py &
```

```
python app/tests.py
```

### Postman tests

```
npm install -g newman
```

```
newman run Postman.json
```





