import time

from db_config import getDb
from db import executeCustomQuery

db = getDb()


def addDbUserLog(u):
    results = executeCustomQuery("insert into logs values()")
    return


def getDbUserLog(username, reportId):
    return


def getDbUserLogs(username):
    results = executeCustomQuery(
        "select log_id as logId, log_name as logName, log_content as logContent from logs where username = '"
        + str(username)
        + "'"
    )

    print("results is:")
    print(results)

    toReturn = []
    for r in results:
        toReturn.append({"logId": r[0], "logName": r[1], "logContent": r[2]})

    print(toReturn)

    return toReturn


def updateDbUserLog(username, logId, logContent):
    return


def deleteAllDbUserLogs(username):
    return
