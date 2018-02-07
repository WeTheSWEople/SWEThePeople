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
