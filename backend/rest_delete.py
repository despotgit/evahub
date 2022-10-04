from flask import Blueprint, json, request
from auth import authenticateJwt
from db_user_logs_broker import deleteDbLog
from db_user_reports_broker import deleteDbReport
from db_user_checks_broker import deleteDbCheck
from db_users_broker import getDbUser

rest_delete = Blueprint("rest_delete", __name__)


# Delete a document (by username, and document id)
@rest_delete.route(
    "/document/type/<documentType>/id/<documentId>/user/<username>",
    methods=["DELETE"],
)
def deleteDocument(documentType, documentId, username):
    print("CHECKPOINT 1")

    authentication = authenticateJwt(username)

    print("CHECKPOINT 2")

    if not authentication["authenticated"]:
        return authentication

    print("CHECKPOINT 3")

    user = getDbUser(username)

    if user == None:
        print("User not found in DB, yeah....")

        response = {
            "authenticated": True,
            "status": "error",
            "message": "User not found in DB.",
        }
    else:
        print("documentType is:")
        print(documentType)

        if documentType == "log":
            deleteDbLog(username, documentId)
            pass
        else:
            if documentType == "report":
                deleteDbReport(username, documentId)
                pass
            else:
                if documentType == "check":
                    deleteDbCheck(username, documentId)
                    pass
                else:
                    response = {
                        "authenticated": True,
                        "status": "fail",
                        "message": "Document type does not exist.",
                    }

        # Return response
        response = {
            "authenticated": True,
            "status": "ok",
            "message": "Document of type "
            + documentType
            + " with id "
            + documentId
            + " successfully deleted.",
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
