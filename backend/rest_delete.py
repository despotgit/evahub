from flask import Blueprint, json, request
from auth import authenticateJwt
from db_users_broker import deleteAllDbUserData, getDbUser

rest_delete = Blueprint("rest_delete", __name__)


# Delete user (by username)
@rest_delete.route("/document/delete", methods=["POST"])
def deleteDocument():
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
