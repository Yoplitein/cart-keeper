import traceback

from flask import Flask, jsonify

def handleUncaughtException(error):
    traceback.print_exception(type(error), error, error.__traceback__)
    
    return jsonify(error="Uncaught exception"), 500

def make_app():
    from ckb.views import root
    
    app = Flask("cart-keeper")
    
    app.register_blueprint(root)
    app.register_error_handler(Exception, handleUncaughtException)
    
    return app

app = make_app()

if __name__ == "__main__":
    app.run()
