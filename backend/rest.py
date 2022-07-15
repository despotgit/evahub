from flask import Blueprint, Flask, json, request
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token

from auth import authenticateJwt, checkIfAuthorized
from db_states_broker import addDbState, deleteDbState, getDbState, setDbState
from db_users_broker import deleteAllDbUserData, getDbUser, updateDbUser
from db_user_reports_broker import getDbUserReports
import config
import requests
from flask import Flask, Blueprint, request, Response, send_from_directory

rest = Blueprint("rest", __name__)


@rest.before_request
# @jwt_required(locations=["headers"])
def before_request():
    print("in before_request")
    pass


# A proxy of some sort
@rest.route("/<path:path>", methods=["GET", "POST"])
def proxy(path):
    print("********************************************************** in proxy")
    # print(request.__dict__.items())
    mimetype = request.mimetype
    protocol = "https"
    if config.FLASK_ENV == "dev":
        protocol = "http"
    print(f"Before: {request.url}", flush=True)
    url = (
        protocol
        + "://"
        + config.API_TARGET_PATH
        + "/"
        + path
        # + "?"
        # + request.query_string.decode("utf-8")
    )
    print(f"After: {url}", flush=True)
    if request.method == "GET":
        r = requests.get(
            url + f'?{request.query_string.decode("utf-8")}',
            headers={"Authorization": request.headers["Authorization"]},
        )
    else:
        r = requests.post(
            url,
            data=request.data,
            headers={"Authorization": request.headers["Authorization"]},
        )
    return Response(r.content, mimetype=mimetype)


# GET - Get user (by username)
@rest.route("/user/get/<username>")
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
            "status": "OK",
            "user": user,
            "message": "User retrieved successfully",
        }

    response = json.jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


# POST - Set user data (by username, field name, and value)
@rest.route("/rest/user/set/<username>", methods=["POST"])
def setUserData(username):
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

        r = json.loads(request.data.decode("UTF-8"))
        updateDbUser(username, r["field"], r["value"])
        user = getDbUser(username)

        # Return response
        response = {
            "authenticated": True,
            "status": "OK",
            "message": "User updated correctly.",
            "user": user,
        }

    response = json.jsonify(response)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


# POST - Delete user (by username)
@rest.route("/rest/user/delete", methods=["POST"])
def deleteUserAccount():
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
        deleteAllDbUserData(username)

        # Return response
        response = {
            "authenticated": True,
            "status": "OK",
            "message": "All user data successfully deleted.",
            "username": username,
        }

    response = json.jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


# GET - Get user's reports (by username)
@rest.route("/reports/get/<username>", methods=["GET"])
def getUserReports(username):
    # print("checkpoint 2.0")
    authentication = authenticateJwt(username)

    # print("authentication is:")
    # print(authentication)

    if not authentication["authenticated"]:
        return authentication

    # print("checkpoint 2.1")

    userReports = getDbUserReports(username)

    if userReports == None:
        print("No reports for the given user")

        response = {
            "authenticated": True,
            "status": "OK",
            "message": "No reports found",
        }
    else:
        response = {
            "authenticated": True,
            "status": "OK",
            "userReports": userReports,
            "message": "User retrieved successfully",
        }

    response = json.jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


# GET - Get state (by username and key)
@rest.route("/rest/state/<username>/<key>")
def getState(username, key):
    authentication = authenticateJwt(username)

    if not authentication["authenticated"]:
        return authentication

    state = getDbState(username, key)

    if state == None:
        print("No state with key " + key + " found for user.")

        response = {
            "authenticated": True,
            "status": "error",
            "message": "No state with given key exists.",
        }

    else:
        response = {"authenticated": True, "status": "OK", "state": state}

    response = json.jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


# POST - Set state, given the username, key and value
@rest.route("/rest/state/<username>", methods=["POST"])
def setState(username):
    authentication = authenticateJwt(username)

    if not authentication["authenticated"]:
        return authentication

    user = getDbUser(username)

    if user == None:
        print("User not found in DB")

        response = json.jsonify(
            {
                "authenticated": True,
                "status": "error",
                "message": "User not found in DB.",
            }
        )
    else:
        r = json.loads(request.data.decode("UTF-8"))
        print(r["value"])
        state = getDbState(username, r["key"])

        if state == None:
            # print("No state with key " + r["key"] + " found. Adding the state.")
            addDbState(username, r["key"], r["value"])
            state = getDbState(username, r["key"])
            response = json.jsonify(
                {
                    "authenticated": True,
                    "status": "OK",
                    "message": "New state is successfully added.",
                    "state": state,
                }
            )
        else:
            # print("State already exists. Setting the state to given value")

            setDbState(username, r["key"], r["value"])
            state = getDbState(username, r["key"])
            response = json.jsonify(
                {
                    "authenticated": True,
                    "status": "OK",
                    "message": "State updated correctly.",
                    "state": state,
                }
            )

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


# POST
@rest.route("/rest/state/delete", methods=["POST"])
def deleteUserState():
    r = json.loads(request.data.decode("UTF-8"))
    username = r["username"]
    key = r["key"]

    authentication = authenticateJwt(username)

    if not authentication["authenticated"]:
        return authentication

    # user = getDbUser(username)
    state = getDbState(username, key)

    if state == None:
        print("State not found in DB")

        response = {
            "authenticated": True,
            "status": "error",
            "message": "State not found in DB.",
        }
    else:
        deleteDbState(username, key)

        # Return response
        response = {
            "authenticated": True,
            "status": "OK",
            "message": "State successfully deleted.",
            "key": key,
        }

    response = json.jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")

    return response


# Custom non-pure REST calls:

# Try to get a restricted resource
@rest.route("/rest/ec-restricted/<username>/<resource>")
def getEcRestrictedResource(username="", resource=""):
    authentication = authenticateJwt(username)

    if not authentication["authenticated"]:
        return authentication

    authorized = checkIfAuthorized(authentication["decodedToken"], resource)

    if authorized:
        response = json.jsonify(
            {
                "status": "OK",
                "message": "You are authorized.",
                "resource": "some very restricted resource",
            }
        )

    else:
        response = json.jsonify(
            {"status": "error", "message": "You are not authorized."}
        )

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
