from flask.helpers import get_debug_flag
import pymongo


def getDb():
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["seta"]
    return mydb
