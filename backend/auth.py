import time
import jwt
import config
import bcrypt
from flask import request, Blueprint
from db_revoked_tokens_broker import isTokenRevoked
from flask import Blueprint, json, request
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token


auth = Blueprint("auth", __name__)

@auth.route("auth/register", methods=["POST"])
def register():
    username = request.form["username"]
    password = request.form["password"]
  
    # Hash a password for the first time, with a randomly-generated salt
    hashed = bcrypt.hashpw(password, bcrypt.gensalt())
    # Check that an unhashed password matches one that has previously been
    # hashed
    if bcrypt.checkpw(password, hashed):
        print("It Matches!")
    else:
        print("It Does not Match :(")

# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@auth.route("/auth/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]

    print("username is:" + username)
    print("password is:" + password)

    #hashed = bcrypt.hashpw(password, bcrypt.gensalt())
    #hashed = in this case we need to take the already created hash from the DB

    if bcrypt.checkpw(password, hashed):
        print("It Matches!")
    else:
        print("It Does not Match :(")
    
    #Fake password check:
    #if username != "test" or password != "test":
    #    return json.jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=username, additional_claims={"some": 123})
    return json.jsonify(access_token=access_token)

# Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.
@auth.route("/auth/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return json.jsonify(logged_in_as=current_user), 200

# GET - Test
@auth.route("/auth/test", methods=["GET"])
def getTest():
  response = json.jsonify({
            "authenticated": True,
            "status": "OK", 
            "message": "Fine"
        })

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
        decodedToken = jwt.decode(jwt_token, config.SECRET_KEY, algorithms=["HS256"])
    except:
        msg = "Token is not valid."
        return {
            "status": "error", 
            "authenticated": False, 
            "message": msg
        }

    if decodedToken["user"]["uid"] != username:
        
        return {
            "status": "error", 
            "authenticated": False, 
            "message": "Username in the JWT token does not match the username being requested."
        }

    # Check if JWT is not expired
    timePassed = time.time() - decodedToken["iat"]

    if timePassed > config.JWT_EXPIRY_INTERVAL:
        return {
            "status": "error",
            "authenticated": False,
            "message": "JWT is expired",
            "expired": True,
        }
    
    # Check that JWT is not revoked
    if isTokenRevoked(username, jwt_token):
        return { 
            "status": "error",
            "authenticated": False,
            "message": "Token is revoked."
        }

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
