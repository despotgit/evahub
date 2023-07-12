from db_config import getDb


def executeCustomQuery(sql, isSelectOneRow=False):
    connection = getDb()
    cursor = connection.cursor()

    cursor.execute(sql)

    if isSelectOneRow:
        results = cursor.fetchone()
    else:
        results = cursor.fetchall()

    return results
