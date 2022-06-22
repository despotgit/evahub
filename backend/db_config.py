
from flaskext.mysql import MySQL
from flask import Flask

app = Flask(__name__)

app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'root'
app.config['MYSQL_DATABASE_DB'] = 'power'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

#app.config['MYSQL_DATABASE_USER'] = 'root'
#app.config['MYSQL_DATABASE_PASSWORD'] = 'root'
#app.config['MYSQL_DATABASE_DB'] = 'power'
#app.config['MYSQL_DATABASE_HOST'] = 'localhost'

def getDb():
  mysql = MySQL(app, prefix='', 
    host=app.config['MYSQL_DATABASE_HOST'], 
    user=app.config['MYSQL_DATABASE_USER'], 
    password=app.config['MYSQL_DATABASE_PASSWORD'], 
    db=app.config['MYSQL_DATABASE_DB'], 
    autocommit=True)
  connection = mysql.connect()
  return connection

def fromDbConfig():
  print("yeah from the db_config")


