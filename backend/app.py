import sqlite3

from flask import Flask
from flask_cors import CORS


app = Flask("Developpement logiciel")
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('database/database.db')
    return conn

@app.route("/", methods=["GET"])
def hello():
    conn = get_db_connection()
    posts = conn.execute('SELECT * FROM horaire').fetchall()
    for row in posts:
        print(row)
    conn.close()
    print(posts)
    return posts

if __name__ == "__main__":
    app.run("localhost", 6969, debug=True)