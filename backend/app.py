import sqlite3

import flask
import json
from flask import Flask, jsonify, request
from flask_cors import CORS

from Search import Search
from GroupCours import GroupCours


app = Flask("Developpement logiciel")
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('database/database.db')
    return conn

@app.route("/startingData", methods=["GET"])
def startingData():

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


@app.route("/similarity", methods=["POST"])
def similarity():
    received_data = request.get_json()
    print(f"received data: {received_data['languages']}")

    #Setup search:
    search_obj = Search()

    #Calculate similarity:         
    cours1, cours2 = search_obj.get_data(
        languages=received_data["languages"],
        credits=received_data["credits"],
        intervenants=received_data["intervenants"],
        branches=received_data["branches"],
        semester=received_data["semester"],
        horaires=received_data["horaires"],
        return_others=True)
    cours1 = GroupCours(cours1)
    cours2 = GroupCours(cours2)

    cours2.similarity(cours1, cluster_type=received_data["similarity_type"])
    
    return jsonify(cours2.dataframe.to_dict(orient="records"))


if __name__ == "__main__":
    app.run("localhost", 6969)