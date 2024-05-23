"""
This module sets up a Flask web application with two endpoints: one for fetching initial data and one for calculating similarity between courses. It utilizes SQLite for the database and Flask-CORS for handling cross-origin requests.

Modules:
    sqlite3: Provides a lightweight disk-based database.
    flask: A micro web framework for Python.
    json: Library for parsing JSON.
    flask_cors: Extension for handling Cross-Origin Resource Sharing (CORS).
    Search: Custom module for handling search functionality.
    GroupCours: Custom module for grouping courses.

Functions:
    get_db_connection: Establishes a connection to the SQLite database.
    startingData: GET endpoint for fetching initial data from the database.
    similarity: POST endpoint for calculating similarity between courses.
"""

import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
from Search import Search
from GroupCours import GroupCours

app = Flask("Developpement logiciel")
CORS(app)

def get_db_connection():
    """
    Establishes a connection to the SQLite database.

    Returns:
        sqlite3.Connection: SQLite connection object.
    """
    conn = sqlite3.connect('database/database.db')
    return conn

@app.route("/startingData", methods=["GET"])
def startingData():
    """
    GET endpoint for fetching initial data from the database.

    Fetches data from 'branche', 'intervenant', and 'horaire' tables.

    Returns:
        flask.Response: JSON response containing initial data.
    """
    conn = get_db_connection()
    courses = conn.execute('SELECT nom, id FROM branche').fetchall()
    teachers = conn.execute('SELECT nom, id FROM intervenant').fetchall()
    horaires = conn.execute('SELECT id, jour, horaire FROM horaire').fetchall()
    conn.close()
    dictionnaire = {
        "cours": courses,
        "intervenants": teachers,
        "horaires": horaires,
    }

    print(dictionnaire)
    return jsonify(dictionnaire)

@app.route("/similarity", methods=["POST"])
def similarity():
    """
    POST endpoint for calculating similarity between courses.

    Receives JSON data and calculates similarity using the Search and GroupCours modules.

    Returns:
        flask.Response: JSON response containing similarity results.
    """
    received_data = request.get_json()
    print(f"received data: {received_data['languages']}")

    # Setup search:
    search_obj = Search()

    # Calculate similarity:
    cours1, cours2 = search_obj.get_data(
        intervenants=received_data["intervenants"],
        branches=received_data["branches"],
        return_others=True)
    cours1 = GroupCours(cours1)
    cours2 = GroupCours(cours2)

    cours2.similarity(cours1, cluster_type=received_data["similarity_type"])
    
    return jsonify(cours2.dataframe.to_dict(orient="records"))

if __name__ == "__main__":
    app.run("localhost", 6969)
