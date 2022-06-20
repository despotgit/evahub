import os

from bson import ObjectId, datetime
from cas import CASClient
from flask import (Flask, Response, json, redirect, render_template, request,
                   send_from_directory, session, url_for)
from flask_cors import CORS
from flask_jwt_extended import JWTManager

import config
from base_routes import base_routes
from db_users_broker import addDbUser, getDbUser
from rest import rest
from rsa import rsa
from auth import auth

from flask import jsonify

app = Flask(__name__)

jwt = JWTManager(app)

app.secret_key = config.SECRET_KEY

app.register_blueprint(rest, url_prefix="/")
app.register_blueprint(auth, url_prefix="/")
app.register_blueprint(base_routes, url_prefix="/seta-ui/")
app.register_blueprint(rsa, url_prefix="/seta-ui/")
    
    
app.config["JWT_SECRET_KEY"] = "FDF89F906815206ABB3270BCB808CDAE6F08BE2B07097A76A507650BD456B4BD"
app.config["JWT_HEADER_TYPE"] = "Bearer"

if config.FLASK_ENV == "dev":
    cors = CORS(app, resources={r"/*": {"origins": "*"}})


class JSONEncoder(json.JSONEncoder):
    """extend json-encoder class"""

    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime.datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)


app.json_encoder = JSONEncoder

app.cas_client = CASClient(
    version=3,
    service_url=config.TARGET_PATH + "/seta-ui/login",  # ?next=%2Fseta-ui%2Fseta
    # server_url='https://django-cas-ng-demo-server.herokuapp.com/cas/'
    server_url="https://webgate.ec.europa.eu/cas/",
)
