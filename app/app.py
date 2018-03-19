from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

config_file = 'config.json'
def create_app():
	app = Flask(__name__, static_folder='static')
	app.config.from_json(config_file)
	from routes import rep_route, root_route, party_route
	app.register_blueprint(root_route, url_prefix='/')
	app.register_blueprint(rep_route, url_prefix='/representative')
	app.register_blueprint(party_route, url_prefix='/party')
	db.init_app(app)
	db.create_all(app=app)
	return app
