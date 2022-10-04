import time
from common import getUserDocumentsDir

from db_config import getDb
from db import executeCustomQuery

db = getDb()


def addDbUserLog(u):
    results = executeCustomQuery("insert into logs values()")
    return


def getDbUserLog(username, reportId):
    return


def getDbUploadedUserLogs(username):
    results = executeCustomQuery(
        "select log_id, log_name, log_filename from logs where username = '"
        + str(username)
        + "'"
    )

    toReturn = []
    for r in results:
        dir = getUserDocumentsDir("log", username)
        filePath = dir + "/" + r[2]

        content = ""

        with open(filePath, "rb") as f:

            lines = f.readlines()

            for line in lines:
                content = content + "\n" + str(line)

        c = content
        toReturn.append({"logId": r[0], "logName": r[1], "logContent": str(c)})

    return toReturn


def deleteAllDbUserLogs(username):
    return


def deleteDbLog(username, logId):
    query = (
        "delete from logs where username='"
        + str(username)
        + "' and log_id="
        + str(logId)
    )

    print("DELETe query is:")
    print(query)

    results = executeCustomQuery(query)

    return results


def getLogContent(logLocation):
    return ""
