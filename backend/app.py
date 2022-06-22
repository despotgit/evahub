import os
import config
from bson import ObjectId, datetime
from cas import CASClient
from flask import (Flask, Response, json, redirect, render_template, request,
                   send_from_directory, session, url_for)
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from db_users_broker import addDbUser, getDbUser
from rest import rest
from auth import auth
from flask import jsonify
from flaskext.mysql import MySQL

app = Flask(__name__)

jwt = JWTManager(app)

app.secret_key = config.SECRET_KEY

app.register_blueprint(rest, url_prefix="/")
app.register_blueprint(auth, url_prefix="/")

app.config["JWT_SECRET_KEY"] = "FDF89F906815206ABB3270BCB808CDAE6F08BE2B07097A76A507650BD456B4BD"
app.config["JWT_HEADER_TYPE"] = "Bearer"

app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'root'
app.config['MYSQL_DATABASE_DB'] = 'power'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql = MySQL()
mysql.init_app(app)

mysql = MySQL(app, prefix='', host="localhost", user="root", password="root", db="power", autocommit=True)
connection = mysql.connect()
cursor = connection.cursor()
cursor.execute("SELECT * FROM users")
results = cursor.fetchall()

for result in results:
  print(result[1])

if config.FLASK_ENV == "dev":
    cors = CORS(app, resources={r"/*": {"origins": "*"}})

