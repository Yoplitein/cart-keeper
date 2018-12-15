from flask import Blueprint

root = Blueprint("root", __name__)

@root.route("/")
def index():
    return "Hello, world!"
