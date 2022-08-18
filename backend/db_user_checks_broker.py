import time

from db_config import getDb
from db import executeCustomQuery

db = getDb()


def addDbUserCheck(u):
    return


def getDbUserCheck(username, checkId):
    return


def getDbUserChecks(username):

    results = executeCustomQuery(
        "select check_id as checkId, check_name as checkName, check_content as checkContent from checks where username = '"
        + str(username)
        + "'"
    )

    print("results is:")
    print(results)

    toReturn = []
    for r in results:
        toReturn.append({"checkId": r[0], "checkName": r[1], "checkContent": r[2]})

    print(toReturn)

    return toReturn


def updateDbUserCheck(username, checkId, checkContent):
    return


def deleteAllDbUserChecks(username):
    return
