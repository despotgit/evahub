import time
from common import getUserDocumentsDir

from db_config import getDb
from db import executeCustomQuery
import json

db = getDb()


def addDbUserDocument(username, documentType):
    results = executeCustomQuery("insert into " + documentType + "s values()")
    return


def getDbUserDocument(username, documentId):
    return


def getUploadedUserDocuments(username, documentType):
    tableName = documentType + "s"
    idField = documentType + "_id"
    nameField = documentType + "_name"
    filenameField = documentType + "_filename"

    results = executeCustomQuery(
        "select "
        + idField
        + ", "
        + nameField
        + ", "
        + filenameField
        + " from "
        + tableName
        + " where username = '"
        + str(username)
        + "'"
    )

    toReturn = []
    for r in results:
        dir = getUserDocumentsDir(documentType, username)
        filePath = dir + "/" + r[2]

        content = ""

        with open(filePath, "rb") as f:
            if documentType == "report":
                content = json.load(f)

            if documentType == "log":
                text = f.read()
                content = str(text, "utf-8")

        toReturn.append(
            {
                documentType + "Id": r[0],
                documentType + "Name": r[1],
                documentType + "Content": content,
            }
        )

    # print(toReturn)

    return toReturn


def deleteAllDbUserDocuments(username, documentType):
    return


def deleteUserDocument(id, username, documentType):
    tableName = documentType + "s"
    idField = documentType + "_id"

    query = (
        "delete from "
        + tableName
        + " where username = '"
        + str(username)
        + "' and "
        + idField
        + " = "
        + id
    )

    print("query is:")
    print(query)

    results = executeCustomQuery(query)

    return results


def getLogContent(logLocation):
    return ""
