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
        "select report_id as reportId, report_name as reportName, report_location as reportLocation from reports where username = '"
        + str(username)
        + "'"
    )

    print("results is:")
    print(results)

    toReturn = []
    for r in results:
        toReturn.append({"reportId": r[0], "reportName": r[1], "reportLocation": r[2]})

    print(toReturn)

    return toReturn


def deleteAllDbUserReports(username):
    return
