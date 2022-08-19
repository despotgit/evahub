def getUserDocumentsDir(documentType, username):
    filePathPrefix = "/Applications/MAMP/htdocs/evahub/backend/"
    rootDir = filePathPrefix + "documents/" + documentType + "s"
    userDir = rootDir + "/" + username
    return userDir
