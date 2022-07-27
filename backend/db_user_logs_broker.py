import time

from db_config import getDb

db = getDb()


def addDbUserLog(u):
    return


def getDbUserLog(username, reportId):
    return


def getDbUserLogs(username):
    return [
        {
            "logId": 1,
            "logContent": "aaa",
            "logName": "first log",
        },
        {
            "logId": 2,
            "logContent": "bbb",
            "logName": "second log",
        },
        {
            "logId": 3,
            "logContent": "ccc",
            "logName": "third log",
        },
    ]


def updateDbUserLog(username, logId, logContent):
    return


def deleteAllDbUserLogs(username):
    return
