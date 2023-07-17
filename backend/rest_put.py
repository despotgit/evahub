import os
from flask import Blueprint, json, request
from flask_jwt_extended import jwt_required
from auth import verifyUser, formatResponse
from db import executeCustomQuery
from common import getDocumentFileInfo

rest_put = Blueprint("rest_put", __name__)


@rest_put.before_request
@jwt_required(locations=["headers"])
def before_request():
    print("************************************* in rest_put in before_request")
    pass


# Set user data (by username, field name, and value)
@rest_put.route(
    "/document/document-type/<documentType>/username/<username>", methods=["PUT"]
)
def uploadDocument(documentType, username):
    v = verifyUser(username)
    if not v["verified"]:
        return formatResponse(v)

    f = request.files["file"]

    finalFilename, userDir, documentFullPath = getDocumentFileInfo(
        documentType, username, f.filename
    )

    if os.path.isdir(userDir):
        print("Directory exists already")
    else:
        os.mkdir(userDir)
        # print("dir created")

    uploadLocation = documentFullPath

    print("uploadLocation is:")
    print(uploadLocation)

    print("f is:")
    print(f)
    f.save(uploadLocation)

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

    return formatResponse(response)
