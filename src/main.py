from flask import Flask

def make_app():
    from ckb.views import root
    
    app = Flask("cart-keeper")
    
    app.register_blueprint(root)
    
    return app

app = make_app()

if __name__ == '__main__':
    app.run()
