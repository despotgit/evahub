import datetime
import time
import jwt
import config
import bcrypt
from flask import request, Blueprint
from db_revoked_tokens_broker import isTokenRevoked
from flask import Blueprint, json, request
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    create_access_token,
    decode_token,
)
from db_config import getDb


auth = Blueprint("auth", __name__)


@auth.route("auth/register", methods=["POST"])
def register():
    username = request.form["username"]
    password = request.form["password"]
    encoding = "utf-8"
    passwordEncoded = password.encode(encoding)

    hashed = bcrypt.hashpw(passwordEncoded, bcrypt.gensalt())

    hashedDecoded = hashed.decode(encoding)

    connection = getDb()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO users (`username`, `password`) VALUES ('"
        + username
        + "', '"
        + hashedDecoded
        + "')"
    )

    # results = cursor.fetchall()
    # for result in results:
    #  print(result[1])

    response = json.jsonify(
        {"status": "OK", "message": "User successfully registered."}
    )

    response.headers.add("Access-Control-Allow-Origin", "*")

    return response


# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@auth.route("/login", methods=["POST"])
def login():

    isPostman = False

    if not isPostman:
        print(request.get_json())

        o = request.get_json()

        username = o["username"]
        password = o["password"]
    else:
        username = request.form["username"]
        password = request.form["password"]

    connection = getDb()
    cursor = connection.cursor()
    sql = "SELECT password, role FROM users WHERE username='" + username + "'"

    cursor.execute(sql)
    results = cursor.fetchall()

    if results == ():
        msg = "No user with that username exists."
        authenticated = False
        status = "Failed"
    else:
        result = results[0]
        dbPassword = result[0]
        dbRole = result[1]

        if bcrypt.checkpw(password.encode("utf-8"), dbPassword.encode("utf-8")):
            # print("It matches!")
            msg = "Login successful."
            authenticated = True
            accessToken = create_access_token(
                identity=username, additional_claims={"some": 123}
            )
            status = "OK"
        else:
            # print("It does not match :(")
            msg = "Login failed."
            authenticated = False
            status = "Failed"

    response = {}
    response["authenticated"] = authenticated
    response["status"] = status
    response["message"] = msg

    if authenticated:
        response["token"] = accessToken
        response["role"] = dbRole
        response["username"] = username
        response["iat"] = datetime.datetime.now().timestamp()

    response = json.jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")

    return response


# Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.
@auth.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return json.jsonify(logged_in_as=current_user), 200


# GET - Test
@auth.route("/test", methods=["GET"])
def getTest():
    response = json.jsonify({"authenticated": True, "status": "OK", "message": "Fine"})

    response.headers.add("Access-Control-Allow-Origin", "*")

    return response


# Check if JWT is genuine and belongs to the user for which the resource is requested
# (i.e. the argument "username" has to be the same as the username in JWT)
def authenticateJwt(username):

    auth_header = request.headers.get("Authorization")
    if auth_header:
        jwt_token = auth_header.split(" ")[1]
    else:
        jwt_token = ""

    # Check that token can be properly decoded
    try:
        decodedToken = decode_token(jwt_token)
    except Exception as e:
        print(e)
        return {"status": "error", "authenticated": False, "message": str(e)}

    print("decodedToken is:")
    print(decodedToken)

    if decodedToken["sub"] != username:

        return {
            "status": "error",
            "authenticated": False,
            "message": "Username in the JWT token does not match the username being requested.",
        }

    # Check if JWT is not expired
    timePassed = time.time() - decodedToken["iat"]

    print("timepassed is:")
    print(timePassed)

    print("config.JWT_EXPIRY_INTERVAL is:")
    print(config.JWT_EXPIRY_INTERVAL)

    if timePassed > config.JWT_EXPIRY_INTERVAL:
        return {
            "status": "error",
            "authenticated": False,
            "message": "JWT is expired",
            "expired": True,
        }

    checkIfRevoked = False

    # Check that JWT is not revoked
    if checkIfRevoked and isTokenRevoked(username, jwt_token):
        return {
            "status": "error",
            "authenticated": False,
            "message": "Token is revoked.",
        }
    else:
        # 1. JWT is valid and authenticated,
        # 2. authorized (username parameter is equal from username from JWT),
        # 3. JWT is not expired
        # 4. JWT is not revoked
        return {
            "status": "OK",
            "authenticated": True,
            "message": "Token successfully verified for given user.",
            "decodedToken": decodedToken,
        }


# Authorization method, based on the decoded token, decide if the user's domain
# is authorized to access that resource
def checkIfAuthorized(decodedToken, resource) -> bool:
    domain = decodedToken["user"]["domain"]

    if domain == "eu.europa.ec":
        isAuthorized = True
    else:
        isAuthorized = False

    # TO DO: Additional checks for the resource in question
    # .....
    print(resource)

    return isAuthorized
