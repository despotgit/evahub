import time
from common import getUserDocumentsDir

from db_config import getDb
from db import executeCustomQuery
import json

db = getDb()


def addDbUserDocument(secureFilename, username):
    res = executeCustomQuery(
        "insert into logs (`log_name`,`filename`,`username`) values ('"
        + secureFilename[:25]
        + "', '"
        + secureFilename
        + "', '"
        + username
        + "')"
    )
    return res


def getUploadedUserDocuments(username, documentType):
    tableName = documentType + "s"
    idField = documentType + "_id"
    nameField = documentType + "_name"

    q = (
        "select "
        + idField
        + ", "
        + nameField
        + ", filename from "
        + tableName
        + " where username = '"
        + str(username)
        + "'"
    )

    print("q is:" + q)

    results = executeCustomQuery(q)

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


def deleteUserDocumentFromDb(username, documentType, id):
    tableName = documentType + "s"
    idField = documentType + "_id"

    dq = (
        "delete from "
        + tableName
        + " where username = '"
        + str(username)
        + "' and "
        + idField
        + " = "
        + id
    )

    # print("query is:")
    # print(dq)

    deleteRes = executeCustomQuery(dq)

    return deleteRes


def getDocumentFilenameFromDb(username, documentType, id):
    tableName = documentType + "s"
    idField = documentType + "_id"

    sq = (
        "select filename from "
        + tableName
        + " where username = '"
        + str(username)
        + "' and "
        + idField
        + "="
        + id
    )

    res = executeCustomQuery(sq, True)

    return res
