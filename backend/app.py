from flask import Flask
import flask
from flask_cors import CORS

app = Flask("Developpement logiciel")
CORS(app)

@app.route("/")
def hello():
    return "Hello, World!"

if __name__ == "__main__":
    app.run("localhost", 6969)