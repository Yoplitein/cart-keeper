import functools
import hashlib
import time

from flask import Blueprint, jsonify, request

from ckb.db import makeItem, addList, touchList, getList, addItems

root = Blueprint("root", __name__)

def readsBody(func):
    @functools.wraps(func)
    def inner(*args, **kwargs):
        if not request.is_json:
            return jsonify(error="Expected JSON body at this endpoint"), 400
        
        return func(request.get_json(), *args, **kwargs)
    
    return inner

@root.route("/")
def index():
    return jsonify(msg="Backend ready")

@root.route("/new", methods=["POST"])
@readsBody
def createList(body):
    valid = (
        all(key in body for key in ["taxRate", "items"]) and
        all(key in list for key in ["name", "quantity", "cost"] for list in body["items"])
    )
    
    if not valid:
        return jsonify(error="Missing required keys"), 400
    
    if len(body["items"]) == 0:
        return jsonify(error="Cannot be empty"), 400
    
    entropy = str(request.remote_addr)
    key = hashlib.sha1(
        (entropy + time.ctime()).encode()
    ).hexdigest()
    items = body["items"]
    
    for index, item in enumerate(items):
        item["price"] = item.pop("cost")
        items[index] = makeItem(**item)
    
    addList(key, body["taxRate"])
    addItems(key, *items)
    
    return jsonify(msg="New list created", key=key)

@root.route("/get/<key>")
def readList(key):
    touchList(key)
    
    try:
        taxRate, _, items = getList(key)
        
        return jsonify(taxRate=taxRate, items=items)
    except KeyError:
        return jsonify(error="That list does not exist"), 404
