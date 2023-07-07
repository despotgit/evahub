from flask import Blueprint, json, request
from flask_jwt_extended import jwt_required
from auth import authenticateJwt
from db_users_broker import getDbUser, updateDbUser

rest_post = Blueprint("rest_post", __name__)


@rest_post.before_request
@jwt_required(locations=["headers"])
def before_request():
    print(
        "************************************************* in rest_post in before_request"
    )
    pass


# Set user data (by username, field name, and value)
# Will be used on Account or Register page to edit user's data
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
