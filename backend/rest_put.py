import os
from flask import Blueprint, json, request
from flask_jwt_extended import jwt_required
from auth import authenticateJwt
from db import executeCustomQuery
from werkzeug.utils import secure_filename
from common import getUserDocumentsDir
from document_file_broker import writeDocumentToFile

rest_put = Blueprint("rest_put", __name__)


@rest_put.before_request
@jwt_required(locations=["headers"])
def before_request():
    print("************************************* in rest_put in before_request")
    pass


# Set user data (by username, field name, and value)
@rest_put.route("/document/<type>/user/<username>", methods=["PUT"])
def uploadDocument(type, username):
    print("type is:")
    print(type)

    authentication = authenticateJwt(username)

    if not authentication["authenticated"]:
        print("Not authenticated for the requested operation")
        return authentication

    writeDocumentToFile(username)

    """"

    f = request.files["file"]

    userDir = getUserDocumentsDir("log", username)

    if os.path.isdir(userDir):
        print()
        # print("exists already")
    else:
        os.mkdir(userDir)
        # print("dir created")

    finalFilename = secure_filename(f.filename)

    uploadLocation = userDir + "/" + finalFilename

    print("uploadLocation is:")
    print(uploadLocation)

    print("f is:")
    print(f)
    f.save(uploadLocation)

    """

    f = request.files["file"]

    finalFilename = secure_filename(f.filename)

    executeCustomQuery(
        "insert into logs (`log_name`,`log_filename`,`username`) values ('"
        + finalFilename[:25]
        + "', '"
        + finalFilename
        + "', '"
        + username
        + "')"
    )

    response = {
        "authenticated": True,
        "status": "ok",
        "message": "File uploaded.",
    }

    response = json.jsonify(response)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
