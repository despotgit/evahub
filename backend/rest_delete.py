from flask import Blueprint, json, request
from auth import verifyUser
from auth import formatResponse
from file_system_manager import removeFile
from db_user_documents_broker import getDocumentFilepath, deleteUserDocumentFromDb

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

    deleteUserDocumentFromDb(documentId, username, documentType)

    filepath = getDocumentFilepath(username, documentType, documentId)

    print("filepath is:" + filepath)

    # removeFile(filepath)

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
