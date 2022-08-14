from flask import Flask, render_template, request, Blueprint, json
from flask import Flask, Blueprint, request, Response, send_from_directory
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
import os

app = Flask(__name__)

upload = Blueprint("upload", __name__)


@upload.route("/user-log-upload", methods=["GET", "POST"])
def upload_file():
    if request.method == "POST":
        print("we're in!!!")

        rootDir = "log_uploads"
        uploadLocation = secure_filename('rootDir + "/" + f.filename')

        f = request.files["file"]
        print("f is:")
        print(f)
        f.save(uploadLocation)

        if os.path.isdir(rootDir):
            print("yeahhhh")
        else:
            print("noahhhhh")

        # os.mkdir("svarog")

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
