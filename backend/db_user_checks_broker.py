import time

from db_config import getDb

db = getDb()


def addDbUserCheck(u):
    return


def getDbUserCheck(username, checkId):
    return


def getDbUserChecks(username):
    return [
        {
            "checkId": 1,
            "checkUserId": 1,
            "checkContent": "ddd",
            "checkName": "first check",
        },
        {
            "checkId": 2,
            "checkUserId": 1,
            "checkContent": "eee",
            "checkName": "second check",
        },
        {
            "checkId": 3,
            "checkUserId": 1,
            "checkContent": "fff",
            "checkName": "third check",
        },
    ]


def updateDbUserCheck(username, checkId, checkContent):
    return


def deleteAllDbUserChecks(username):
    return
