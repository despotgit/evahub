import time

from db_config import getDb
from db import getValuesFromDb

db = getDb()


def addDbUserReport(u):
    return


def getDbUserReport(username, reportId):
    return


def getDbUserReports(username):

    results = getValuesFromDb(
        "select report_id as reportId, user_id as reportUserId, report_name as reportName, report_content as reportContent from reports where report_username = '"
        + str(username)
        + "'"
    )

    print("results is:")
    print(results)

    toReturn = []
    for r in results:
        toReturn.append({"reportId": r[0], "reportName": r[2], "reportContent": r[3]})

    print(toReturn)

    return toReturn


def updateDbUserReport(username, reportId, reportContent):
    return


def deleteAllDbUserReports(username):
    return
