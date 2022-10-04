import time
from db import executeCustomQuery

from db_config import getDb

db = getDb()


def addDbUser(u):
    return 1


def getDbUser(username):

    results = executeCustomQuery(
        "select username, email, role from users where username = '"
        + str(username)
        + "'"
    )

    return results[0]


def updateDbUser(username, field, value):
    return 1


def deleteAllDbUserData(username):
    return 1
