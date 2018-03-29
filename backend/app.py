from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy_searchable import make_searchable
from sqlalchemy.ext.declarative import declarative_base

db = SQLAlchemy()

#Base = declarative_base()
make_searchable(db.metadata)


config_file = 'config_dev.json'
def create_app(config_file='config_dev.json'):
	app = Flask(__name__, static_folder='static')
	CORS(app)
	app.config.from_json(config_file)
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
