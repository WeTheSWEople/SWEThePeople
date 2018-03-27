from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

config_file = 'config.json'
def create_app(config_file='config.json'):
	app = Flask(__name__, static_folder='static')
	CORS(app)
	app.config.from_json(config_file)
	from routes import rep_route, root_route, party_route, district_route, state_route
	app.register_blueprint(root_route, url_prefix='/')
	app.register_blueprint(rep_route, url_prefix='/representative')
	app.register_blueprint(party_route, url_prefix='/party')
	app.register_blueprint(district_route, url_prefix='/district')
	app.register_blueprint(state_route, url_prefix='/state')
	db.init_app(app)
	db.create_all(app=app)	
	return app
