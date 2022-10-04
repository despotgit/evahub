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
        "select check_id as checkId, check_name as checkName, check_location as checkLocation from checks where username = '"
        + str(username)
        + "'"
    )

    # print("results is:")
    # print(results)

    toReturn = []
    for r in results:
        toReturn.append({"checkId": r[0], "checkName": r[1], "checkLocation": r[2]})

    # print(toReturn)

    return toReturn


def deleteAllDbUserChecks(username):
    return


def deleteDbCheck(username, checkId):
    query = (
        "delete from checks where username='"
        + str(username)
        + "' and report_id="
        + str(checkId)
    )

    print("DELETe query is:")
    print(query)

    results = executeCustomQuery(query)

    return results
