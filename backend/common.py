from werkzeug.utils import secure_filename


def getUserDocumentsDir(documentType, username):
    filePathPrefix = "/Applications/MAMP/htdocs/evahub/backend/"
    rootDir = filePathPrefix + "documents/" + documentType + "s"
    userDir = rootDir + "/" + username
    return userDir


def getDocumentFileInfo(documentType, username, filename, secureFilename=False):
    if secureFilename:
        fn = secure_filename(filename)
    else:
        fn = filename

    print("fn is:")
    print(fn[0])
    userDir = getUserDocumentsDir(documentType, username)
    fullFileLocation = userDir + "/" + fn

    return fn, userDir, fullFileLocation
