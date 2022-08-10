from flask import Flask, render_template, request, Blueprint, json
from flask import Flask, Blueprint, request, Response, send_from_directory
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage

app = Flask(__name__)

upload = Blueprint("upload", __name__)


@upload.route("/user_log_upload", methods=["GET", "POST"])
def upload_file():
    if request.method == "POST":
        print("were in!!!")

        app.config["UPLOAD_FOLDER"] = "log_uploads"
        app.config["MAX_CONTENT_PATH"] = 999999999999

        f = request.files["file"]
        print("f is:")
        print(f)
        f.save("log_uploads/" + f.filename)

        print("and yes!:")
        print(secure_filename(f.filename))
        f.save(secure_filename(f.filename))

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
