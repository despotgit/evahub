from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import JWT_EXPIRY_INTERVAL
from rest import rest
from rest_get import rest_get
from rest_post import rest_post
from auth import auth
from upload import upload

import config

app = Flask(__name__)

app.config["JWT_HEADER_TYPE"] = "Bearer"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = JWT_EXPIRY_INTERVAL

jwt = JWTManager(app)

app.secret_key = config.SECRET_KEY

app.register_blueprint(rest, url_prefix="/rest")
app.register_blueprint(rest_get, url_prefix="/rest/get")
app.register_blueprint(rest_post, url_prefix="/rest/post")
app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(upload, url_prefix="/upload")

if config.FLASK_ENV == "dev":
    cors = CORS(app, resources={r"/*": {"origins": "*"}})
