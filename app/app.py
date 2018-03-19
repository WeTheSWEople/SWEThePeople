from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

config_file = 'config.json'
def create_app():
	app = Flask(__name__, static_folder='static')
	CORS(app)
	app.config.from_json(config_file)

	db.init_app(app)
	db.create_all(app=app)

	from routes import rep_route, root_route, error_route
	app.register_blueprint(error_route)
	app.register_blueprint(root_route, url_prefix='/')
	app.register_blueprint(rep_route, url_prefix='/representative')
	
	return app
