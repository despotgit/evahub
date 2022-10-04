from flask import Blueprint, Flask, json, request
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token

from auth import authenticateJwt
from db_states_broker import addDbState, deleteDbState, getDbState, setDbState
from db_users_broker import deleteAllDbUserData, getDbUser, updateDbUser
from db_user_reports_broker import getDbUserReports
from db_user_logs_broker import getUploadedUserLogs
from db_user_checks_broker import getDbUserChecks
import requests
from flask import Flask, Blueprint, request, Response, send_from_directory

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

    userLogs = getUploadedUserLogs(username)

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
