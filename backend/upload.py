from flask import Flask, render_template, request, Blueprint, json
from flask import Flask, Blueprint, request, Response, send_from_directory
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
import os

app = Flask(__name__)

upload = Blueprint("upload", __name__)


# PUT - Upload a file
@upload.route("/user-log-upload/<username>", methods=["POST"])
def upload_file(username):
    if request.method == "POST":
        print("username is:" + username)

        print("we're in!!!")

        f = request.files["file"]

        rootDir = "log_uploads"
        userDir = rootDir + "/" + username

        if os.path.isdir(userDir):
            print("exists already")
        else:
            os.mkdir(userDir)
            print("dir created")

        uploadLocation = userDir + "/" + secure_filename(f.filename)

        print("f is:")
        print(f)
        f.save(uploadLocation)

        response = {
            "authenticated": "maybe",
            "status": "maybe ok",
            "user": "some maybe user",
            "message": "cool",
        }

        response = json.jsonify(response)

        response.headers.add("Access-Control-Allow-Origin", "*")
        return response


if __name__ == "__main__":
    upload.run(debug=True)
