from db_config import getDb


def executeCustomQuery(sql):
    connection = getDb()
    cursor = connection.cursor()

    cursor.execute(sql)
    results = cursor.fetchall()

    return results
