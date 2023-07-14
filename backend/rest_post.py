from flask import Blueprint, json, request
from flask_jwt_extended import jwt_required
from auth import verifyUser, formatResponse
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
# Will be used on Account page to edit user's data
@rest_post.route("/user/set/<username>", methods=["POST"])
def setUserData(username):
    v = verifyUser(username)
    if not v["verified"]:
        return formatResponse(v)

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

    return formatResponse(response)
