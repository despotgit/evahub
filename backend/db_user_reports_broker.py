import time

from db_config import getDb

db = getDb()


def addDbUserReport(u):
    return


def getDbUserReport(username, reportId):
    return


def getDbUserReports(username):
    return [
        {"userId": 1, "content": "aaa"},
        {"userId": 2, "content": "bbb"},
        {"userId": 3, "content": "ccc"},
    ]


def updateDbUserReport(username, reportId, reportContent):
    return


def deleteAllDbUserReports(username):
    return
