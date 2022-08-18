import time

from db_config import getDb
from db import executeCustomQuery

db = getDb()


def addDbUserReport(u):
    return


def getDbUserReport(username, reportId):
    return


def getDbUserReports(username):
    results = executeCustomQuery(
        "select report_id as reportId, report_name as reportName, report_content as reportContent from reports where username = '"
        + str(username)
        + "'"
    )

    print("results is:")
    print(results)

    toReturn = []
    for r in results:
        toReturn.append({"reportId": r[0], "reportName": r[1], "reportContent": r[2]})

    print(toReturn)

    return toReturn


def updateDbUserReport(username, reportId, reportContent):
    return


def deleteAllDbUserReports(username):
    return
