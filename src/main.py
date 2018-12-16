import traceback

from flask import Flask, jsonify

def setCorsHeader(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "content-type"
    
    return response

def handleUncaughtException(error):
    traceback.print_exception(type(error), error, error.__traceback__)
    
    return jsonify(error="Uncaught exception"), 500

def make_app():
    from ckb.views import root
    
    app = Flask("ckb")
    app.debug = __name__ == "__main__"
    
    app.register_blueprint(root)
    app.register_error_handler(Exception, handleUncaughtException)
    
    if app.debug:
        app.after_request(setCorsHeader)
    
    return app

app = make_app()

if __name__ == "__main__":
    app.run()
