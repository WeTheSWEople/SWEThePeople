
import os
from flask import Flask # noqa
from flask_cors import CORS # noqa
from flask_sqlalchemy import SQLAlchemy # noqa


db = SQLAlchemy()

"""
File to create a backend application
"""


def create_app():
    """
    function to create and start the backend application (our api)
    """
    app = Flask(__name__, static_folder='static')
    CORS(app)
    # set the database credentials from environment variables
    # TA(s): ask us for the db credentials if you need  it
    app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql+psycopg2://" + \
        os.environ['DB_USER'] + ":" + os.environ['DB_PASS'] + "@" + \
        os.environ['DB_HOST'] + "/" + os.environ['DB_NAME']
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['DEBUG'] = True
    # this is to avoid circular dependencies
    from routes import rep_route, root_route, party_route, district_route, \
        state_route, search_route
    # register api endpoints
    app.register_blueprint(root_route, url_prefix='/')
    app.register_blueprint(rep_route, url_prefix='/representative')
    app.register_blueprint(party_route, url_prefix='/party')
    app.register_blueprint(district_route, url_prefix='/district')
    app.register_blueprint(state_route, url_prefix='/state')
    app.register_blueprint(search_route, url_prefix='/search')
    db.init_app(app)
    import models # noqa
    with app.app_context():
        db.configure_mappers()
        db.create_all(app=app)
    return app
