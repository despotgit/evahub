from flask import Blueprint, json
from flask_jwt_extended import jwt_required
from auth import authenticateJwt
from db_users_broker import getDbUser
from db_user_reports_broker import getDbUserReports
from db_user_logs_broker import getDbUploadedUserLogs
from db_user_checks_broker import getDbUserChecks


rest_get = Blueprint("rest_get", __name__)


@rest_get.before_request
@jwt_required(locations=["headers"])
def before_request():
    print("************************************ in rest_get in before_request")
    pass


# Get user (by username)
@rest_get.route("/user/get/<username>", methods=["GET"])
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


# Get user's reports (by username)
@rest_get.route("/reports/<username>", methods=["GET"])
def getUserReports(username):

    authentication = authenticateJwt(username)

    # print("authentication is:")
    # print(authentication)

    if not authentication["authenticated"]:
        return authentication

    userReports = getDbUserReports(username)

    if userReports == None:
        print("No reports for the given user")

        response = {
            "authenticated": True,
            "status": "ok",
            "message": "No reports found",
        }
    else:
        response = {
            "authenticated": True,
            "status": "ok",
            "userReports": userReports,
            "message": "Reports retrieved successfully",
        }

    response = json.jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


# Get user's logs (by username)
@rest_get.route("/logs/<username>", methods=["GET"])
def getUserLogs(username):

    authentication = authenticateJwt(username)

    # print("authentication is:")
    # print(authentication)

    if not authentication["authenticated"]:
        return authentication

    userLogs = getDbUploadedUserLogs(username)

    if userLogs == None:
        print("No logs for the given user")

        response = {
            "authenticated": True,
            "status": "ok",
            "message": "No reports found",
        }
    else:
        response = {
            "authenticated": True,
            "status": "ok",
            "userLogs": userLogs,
            "message": "Logs retrieved successfully",
        }

    response = json.jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


# Get user's checks (by username)
@rest_get.route("/checks/<username>", methods=["GET"])
def getUserChecks(username):

    authentication = authenticateJwt(username)

    # print("authentication is:")
    # print(authentication)

    if not authentication["authenticated"]:
        return authentication

    userChecks = getDbUserChecks(username)

    if userChecks == None:
        print("No logs for the given user")

        response = {
            "authenticated": True,
            "status": "ok",
            "message": "No reports found",
        }
    else:
        response = {
            "authenticated": True,
            "status": "ok",
            "userChecks": userChecks,
            "message": "Checks retrieved successfully",
        }

    response = json.jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
