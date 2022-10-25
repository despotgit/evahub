import os
from flask import request
from werkzeug.utils import secure_filename
from common import getUserDocumentsDir


def writeDocumentToFile(username):
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
