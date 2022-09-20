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


def getUploadedUserLogs(username):
    results = executeCustomQuery(
        "select log_id, log_name, log_filename from logs where username = '"
        + str(username)
        + "'"
    )

    # print("results is:")
    # print(results)

    # with open('textfile.txt', 'r') as f:
    #    return text=f.read()

    # r = open("textfile.txt", "r")
    # content = r.read()

    toReturn = []
    for r in results:
        dir = getUserDocumentsDir("log", username)
        filePath = dir + "/" + r[2]

        content = ""

        with open(filePath, "r") as f:

            lines = f.readlines()

            for line in lines:
                content = content + "\n" + str(line)
                # print(line)

        # c = str(content)
        c = content
        # print("content is:!!!!!")
        # print(c)
        toReturn.append({"logId": r[0], "logName": r[1], "logContent": c})

    # print(toReturn)

    return toReturn


def deleteAllDbUserLogs(username):
    return


def getLogContent(logLocation):
    return ""
