from flask import Flask, request, Blueprint, json
from flask import Flask, Blueprint, request, Response
from werkzeug.datastructures import FileStorage
import os
from db import executeCustomQuery

app = Flask(__name__)

register = Blueprint("register", __name__)


# POST
@register.route("/user", methods=["POST"])
def register_user():

    print("request is:")
    print(request)

    response = {
        "authenticated": True,
        "status": "ok",
        "message": "User successfully registered.",
    }

    response = json.jsonify(response)

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


if __name__ == "__main__":
    register.run(debug=True)
