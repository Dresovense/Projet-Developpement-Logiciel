import sqlite3

from flask import Flask,jsonify
from flask_cors import CORS


app = Flask("Developpement logiciel")
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('database/database.db')
    return conn

@app.route("/", methods=["GET"])
def hello():
    conn = get_db_connection()
    courses = conn.execute('SELECT nom, id FROM branche').fetchall()
    teachers = conn.execute('SELECT nom, id FROM intervenant').fetchall()
    conn.close()
    dictionnaire = {
        "cours" : courses,
        "intervenants" : teachers,
    }

    print(dictionnaire)
    return jsonify(dictionnaire)

if __name__ == "__main__":
    app.run("localhost", 6969)