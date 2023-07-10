from flask import Blueprint, json, request
from auth import authenticateJwt
from db_users_broker import deleteAllDbUserData, getDbUser
from db_user_documents_broker import deleteUserDocument

rest_delete = Blueprint("rest_delete", __name__)


# Delete a document (by username, and document id)
@rest_delete.route(
    "/document/id/<documentId>/username/<username>/document-type/<documentType>",
    methods=["DELETE"],
)
def deleteDocument(documentId, username, documentType):
    print("in deleteDocument")

    print("documentId is:" + documentId)
    print("username is:" + username)
    print("documentType is:" + documentType)

    r = json.loads(request.data.decode("UTF-8"))
    username = r["username"]

    authentication = authenticateJwt(username)

    if not authentication["authenticated"]:
        return authentication

    user = getDbUser(username)

    if user == None:
        print("User not found in DB")

        response = {
            "authenticated": True,
            "status": "error",
            "message": "User not found in DB.",
        }
    else:
        deleteUserDocument(documentId, username, documentType)

        # Return response
        response = {
            "authenticated": True,
            "status": "ok",
            "message": "Document with id " + documentId + " is  successfully deleted.",
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
