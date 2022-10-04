from flask import Blueprint, Flask, json, request
from flask_jwt_extended import jwt_required
from auth import authenticateJwt
from db_states_broker import addDbState, deleteDbState, getDbState, setDbState
from db_users_broker import deleteAllDbUserData, getDbUser, updateDbUser

from flask import Flask, Blueprint, request, Response, send_from_directory

rest_post = Blueprint("rest_post", __name__)


@rest_post.before_request
@jwt_required(locations=["headers"])
def before_request():
    print(
        "************************************************* in rest_post in before_request"
    )
    pass


# Set user data (by username, field name, and value)
@rest_post.route("/user/set/<username>", methods=["POST"])
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
            "status": "ok",
            "message": "User updated correctly.",
            "user": user,
        }

    response = json.jsonify(response)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


# Set a custom state, given the username, key and value
@rest_post.route("/state/<username>", methods=["POST"])
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
                    "status": "ok",
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
                    "status": "ok",
                    "message": "State updated correctly.",
                    "state": state,
                }
            )

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


# Delete a state
@rest_post.route("/state/delete", methods=["POST"])
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
            "status": "ok",
            "message": "State successfully deleted.",
            "key": key,
        }

    response = json.jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")

    return response


# Delete user (by username)
@rest_post.route("/user/delete", methods=["POST"])
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
            "status": "ok",
            "message": "All user data successfully deleted.",
            "username": username,
        }

    response = json.jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
