import functools

import pg8000

def withCursor(func):
    @functools.wraps(func)
    def inner(*args, **kwargs):
        conn = None
        
        try:
            #TODO: cache, config
            conn = pg8000.connect(user="postgres", password="")
            result = func(conn.cursor(), *args, **kwargs)
            
            conn.commit()
            
            return result
        except:
            if conn:
                conn.rollback()
            
            raise
    
    return inner

def makeItem(name, quantity, price, isWeighted=False):
    return dict(name=name, quantity=quantity, price=price, isWeighted=isWeighted)

@withCursor
def addList(cursor, listKey, taxRate):
    cursor.execute(r"INSERT INTO ck_list(key, taxRate) VALUES(%s, %s)", (listKey, taxRate))

@withCursor
def touchList(cursor, listKey):
    cursor.execute(r"UPDATE ck_list SET lastAccessed = NOW() WHERE key = %s", (listKey,))

@withCursor
def getList(cursor, key):
    listID = getListIDFromKey(key)
    
    cursor.execute(r"SELECT taxRate, lastAccessed FROM ck_list WHERE id = %s", (listID,))
    
    taxRate, lastAccessed = cursor.fetchall()[0]
    
    cursor.execute(r"SELECT name, quantity, price, isWeighted FROM ck_item WHERE listID = %s", (listID,))
    
    items = cursor.fetchall()
    
    return (taxRate, lastAccessed, [makeItem(*item) for item in items])

@withCursor
def getListIDFromKey(cursor, listKey):
    cursor.execute(r"SELECT id FROM ck_list WHERE key = %s", (listKey,))
    
    result = cursor.fetchall()
    
    if len(result) > 0:
        return result[0][0]
    else:
        raise KeyError("Unable to find list with key {!r}".format(listKey))

@withCursor
def removeList(cursor, listKey):
    cursor.execute(r"DELETE FROM ck_list WHERE key = %s", (listKey,))

@withCursor
def addItems(cursor, listKey, *items):
    listID = getListIDFromKey(listKey)
    
    for item in items:
        cursor.execute(
            r"INSERT INTO ck_item(listID, name, quantity, price, isWeighted) VALUES(%s, %s, %s, %s, %s)",
            (listID, item["name"], item["quantity"], item["price"], item["isWeighted"])
        )

@withCursor
def removeItem(cursor, itemID):
    cursor.execute(r"DELETE FROM ck_item WHERE id = %s", (itemID,))
