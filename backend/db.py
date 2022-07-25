from db_config import getDb


def getValuesFromDb(sql):
    connection = getDb()
    cursor = connection.cursor()

    cursor.execute(sql)
    results = cursor.fetchall()

    return results
