import time

from db_config import getDb
from db import getValuesFromDb

db = getDb()


def addDbUserCheck(u):
    return


def getDbUserCheck(username, checkId):
    return


def getDbUserChecks(username):

    results = getValuesFromDb(
        "select check_id as checkId, user_id as checkUserId, check_name as checkName, check_content as checkContent from checks where check_username = '"
        + str(username)
        + "'"
    )

    print("results is:")
    print(results)

    toReturn = []
    for r in results:
        toReturn.append({"checkId": r[0], "checkName": r[2], "checkContent": r[3]})

    print(toReturn)

    return toReturn


def updateDbUserCheck(username, checkId, checkContent):
    return


def deleteAllDbUserChecks(username):
    return
