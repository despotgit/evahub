from flask import Flask, render_template, request, Blueprint, json
from flask import Flask, Blueprint, request, Response, send_from_directory
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
import os
from auth import authenticateJwt
from common import getUserDocumentsDir
from db import executeCustomQuery

app = Flask(__name__)

upload = Blueprint("upload", __name__)


# POST - Upload a log file
@upload.route("/user-log-upload/<username>", methods=["POST"])
def upload_file(username):
    authentication = authenticateJwt(username)

    if not authentication["authenticated"]:
        return authentication

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


if __name__ == "__main__":
    upload.run(debug=True)
