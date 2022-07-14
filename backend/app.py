from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import JWT_EXPIRY_INTERVAL
from rest import rest
from auth import auth
import config

app = Flask(__name__)

app.config[
    "JWT_SECRET_KEY"
] = "FDF89F906815206ABB3270BCB808CDAE6F08BE2B07097A76A507650BD456B4BD"
app.config["JWT_HEADER_TYPE"] = "Bearer"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = JWT_EXPIRY_INTERVAL

jwt = JWTManager(app)

app.secret_key = config.SECRET_KEY

app.register_blueprint(rest, url_prefix="/")
app.register_blueprint(auth, url_prefix="/")

if config.FLASK_ENV == "dev":
    cors = CORS(app, resources={r"/*": {"origins": "*"}})
