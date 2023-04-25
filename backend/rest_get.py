from flask import Blueprint, json
from flask_jwt_extended import jwt_required
from auth import authenticateJwt
from db_user_documents_broker import getUploadedUserDocuments
from db_users_broker import getDbUser

rest_get = Blueprint("rest_get", __name__)


@rest_get.before_request
@jwt_required(locations=["headers"])
def before_request():
    print("************************************ in rest_get in before_request")
    pass


# Get user (by username)
# will be used on Account or Register page for getting the user's data
@rest_get.route("/user/username/<username>", methods=["GET"])
def getUserData(username):
    authentication = authenticateJwt(username)

    if not authentication["authenticated"]:
        return authentication

    user = getDbUser(username)

    if user == None:
        print("User not found in DB")

        response = {
            "authenticated": True,
            "status": "error",
            "message": "User not found",
        }
    else:
        response = {
            "authenticated": True,
            "status": "ok",
            "user": user,
            "message": "User retrieved successfully",
        }

    response = json.jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


# Get user's documents (by username and document type)
@rest_get.route("documents/type/<documentType>/username/<username>", methods=["GET"])
def getUserDocuments(documentType, username):
    authentication = authenticateJwt(username)

    # print("authentication is:")
    # print(authentication)

    if not authentication["authenticated"]:
        return authentication

    userDocuments = getUploadedUserDocuments(username, documentType)

    if userDocuments == None:
        print("No documents of given type for the user are found.")

        response = {
            "authenticated": True,
            "status": "ok",
            "message": "No documents of given type found for the user.",
        }
    else:
        response = {
            "authenticated": True,
            "status": "ok",
            "userDocuments": userDocuments,
            "documentType": documentType,
            "message": "Documents retrieved successfully.",
        }

    response = json.jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
