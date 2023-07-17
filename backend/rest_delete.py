from flask import Blueprint, json, request
from auth import verifyUser
from auth import formatResponse
from db_user_documents_broker import deleteUserDocument

rest_delete = Blueprint("rest_delete", __name__)


# Delete a document (by username, and document id)
@rest_delete.route(
    "/document/id/<documentId>/username/<username>/document-type/<documentType>",
    methods=["DELETE"],
)
def deleteDocument(documentId, username, documentType):
    v = verifyUser(username)
    if not v["verified"]:
        return formatResponse(v)

    deleteUserDocument(documentId, username, documentType)

    sq = (
        "select filepath from "
        + tableName
        + " where username = '"
        + str(username)
        + "' and "
        + idField
        + "="
        + id
    )

    searchRes = executeCustomQuery(sq)

    # finalFilename, userDir, documentFullPath = getDocumentFileInfo(
    #    documentType, username, f.filename
    # )

    print("sq res[0] is:" + str(searchRes[0]))

    print("sq is:" + sq)

    getDocumentFileInfo

    # Return response
    response = {
        "authenticated": True,
        "status": "ok",
        "message": "Document with id " + documentId + " is successfully deleted.",
        "username": username,
    }

    return formatResponse(response)


# Delete user (by username)
@rest_delete.route("/user/<username>", methods=["DELETE"])
def deleteUser():
    r = {}
    return formatResponse(r)
