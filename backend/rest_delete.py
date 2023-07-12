from flask import Blueprint, json, request
from auth import verifyUser
from db_users_broker import deleteAllDbUserData, getDbUser
from db_user_documents_broker import deleteUserDocument

rest_delete = Blueprint("rest_delete", __name__)


# Delete a document (by username, and document id)
@rest_delete.route(
    "/document/id/<documentId>/username/<username>/document-type/<documentType>",
    methods=["DELETE"],
)
def deleteDocument(documentId, username, documentType):
    v = verifyUser(username)
    if v != True:
        return v

    deleteUserDocument(documentId, username, documentType)

    # Return response
    response = {
        "authenticated": True,
        "status": "ok",
        "message": "Document with id " + documentId + " is successfully deleted.",
        "username": username,
    }

    response = json.jsonify(response)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


# Delete user (by username)
@rest_delete.route("/user/<username>", methods=["DELETE"])
def deleteUser():
    response = json.jsonify({})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
