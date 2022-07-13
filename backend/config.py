import os
from flask import Flask

FLASK_APP = "app.py"
FLASK_ENV = "dev"
LOGIN_EXPIRY_DEV = 3600
LOGIN_EXPIRY_TEST = 3600
LOGIN_EXPIRY_PROD = 3600
SECRET_KEY = "2a43ca5b42240a33dadc64beace65d1f"
# os.environ variables can also be taken from .env file
# environment = os.environ.get("FLASK_ENV")

# SECRET_KEY = os.environ.get("SECRET_KEY")
app = Flask(__name__)

if "dev" == FLASK_ENV:
    TARGET_PATH = "http://localhost:5000"
    # TARGET_PATH = "http://localhost:8080"
    # API_TARGET_PATH = "seta-test.emm4u.eu/seta-api/seta/api/v1"
    API_TARGET_PATH = "seta-test.emm4u.eu/seta-api/seta/api/v1"
    JWT_EXPIRY_INTERVAL = LOGIN_EXPIRY_DEV
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = LOGIN_EXPIRY_DEV

if "test" == FLASK_ENV:
    TARGET_PATH = "https://seta-test.emm4u.eu"
    # API_TARGET_PATH = "seta-test.emm4u.eu/seta-api/seta/api/v1"
    API_TARGET_PATH = "seta-test.emm4u.eu/seta-api/seta/api/v1"
    JWT_EXPIRY_INTERVAL = LOGIN_EXPIRY_TEST
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = LOGIN_EXPIRY_TEST

if "production" == FLASK_ENV:
    TARGET_PATH = "https://seta.emm4u.eu"
    # API_TARGET_PATH = "seta-test.emm4u.eu/seta-api/seta/api/v1"
    API_TARGET_PATH = "seta-test.emm4u.eu/seta-api/seta/api/v1"
    JWT_EXPIRY_INTERVAL = LOGIN_EXPIRY_PROD
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = LOGIN_EXPIRY_PROD

JWT_TOKEN_LOCATION = ["headers"]

JWT_EXPIRY_INTERVAL = float(JWT_EXPIRY_INTERVAL)
