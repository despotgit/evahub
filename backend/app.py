from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import JWT_EXPIRY_INTERVAL
from rest import rest
from auth import auth
from upload import upload
from register import register

import config

app = Flask(__name__)

app.config["JWT_HEADER_TYPE"] = "Bearer"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = JWT_EXPIRY_INTERVAL

jwt = JWTManager(app)

app.secret_key = config.SECRET_KEY

app.register_blueprint(rest, url_prefix="/rest")
app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(upload, url_prefix="/upload")
app.register_blueprint(register, url_prefix="/pregister")

if config.FLASK_ENV == "dev":
    cors = CORS(app, resources={r"/*": {"origins": "*"}})
