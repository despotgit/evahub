import time

from db_config import getDb

db = getDb()


def addDbUserReport(u):
    return


def getDbUserReport(username, reportId):
    return


def getDbUserReports(username):
    return [
        {
            "reportId": 1,
            "reportUserId": 1,
            "reportContent": "aaa",
            "reportName": "first report",
        },
        {
            "reportId": 2,
            "reportUserId": 1,
            "reportContent": "bbb",
            "reportName": "second report",
        },
        {
            "reportId": 3,
            "reportUserId": 1,
            "reportContent": "ccc",
            "reportName": "third report",
        },
    ]


def updateDbUserReport(username, reportId, reportContent):
    return


def deleteAllDbUserReports(username):
    return
