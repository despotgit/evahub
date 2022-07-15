from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import JWT_EXPIRY_INTERVAL
from rest import rest
from auth import auth
import config

app = Flask(__name__)

app.config["JWT_HEADER_TYPE"] = "Bearer"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = JWT_EXPIRY_INTERVAL

jwt = JWTManager(app)

app.secret_key = config.SECRET_KEY

app.register_blueprint(rest, url_prefix="/rest")
app.register_blueprint(auth, url_prefix="/auth")

if config.FLASK_ENV == "dev":
    cors = CORS(app, resources={r"/*": {"origins": "*"}})
