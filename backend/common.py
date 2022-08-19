def getUserDocumentsDir(documentType, username):
    rootDir = "documents/" + documentType + "s"
    userDir = rootDir + "/" + username
    return userDir
