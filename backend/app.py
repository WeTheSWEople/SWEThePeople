from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy_searchable import make_searchable
from sqlalchemy.ext.declarative import declarative_base
import os
db = SQLAlchemy()

#Base = declarative_base()
make_searchable(db.metadata)


config_file = 'config_dev.json'
def create_app(config_file='config_dev.json'):
	app = Flask(__name__, static_folder='static')
	CORS(app)
	#app.config.from_json(config_file)
	print("EEEEEEENNNNVVV: ", os.environ['DB_PASS'])
	print("EEEEEEENNNNVVVHHHOOME: ", os.environ['HOME'])
	app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql+psycopg2://swetheuser:" + os.environ['DB_PASS'] + "@swethepeopledev.ck2wxwtc2yr5.us-east-2.rds.amazonaws.com:5432/swethepeopledev"
	app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
	app.config['DEBUG'] = True
	from routes import rep_route, root_route, party_route, district_route, state_route, search_route
	app.register_blueprint(root_route, url_prefix='/')
	app.register_blueprint(rep_route, url_prefix='/representative')
	app.register_blueprint(party_route, url_prefix='/party')
	app.register_blueprint(district_route, url_prefix='/district')
	app.register_blueprint(state_route, url_prefix='/state')
	app.register_blueprint(search_route, url_prefix='/search')
	db.init_app(app)
	import models
	with app.app_context():
		db.configure_mappers()
		db.create_all(app=app)	
	return app
