import time

from db_config import getDb

db = getDb()


def addDbUserReport(u):
    return


def getDbUserReport(username, reportId):
    return


def getDbUserReports(username):
    return [
        {"reportUserId": 1, "reportContent": "aaa", "reportName": "first"},
        {"reportUserId": 1, "reportContent": "bbb", "reportName": "second"},
        {"reportUserId": 1, "reportContent": "ccc", "reportName": "third"},
    ]


def updateDbUserReport(username, reportId, reportContent):
    return


def deleteAllDbUserReports(username):
    return
