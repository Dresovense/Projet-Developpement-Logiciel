"""
This script sets up the SQLite database by creating tables and initializing the schema based on the provided SQL script.

Functions:
    None

Procedures:
    Establishes a connection to the SQLite database.
    Executes the SQL script to create and initialize database schema.
    Commits the changes to the database.
    Closes the connection to the database.
"""

import sqlite3

# Establish a connection to the SQLite database
connection = sqlite3.connect('database/database.db')

# Open and execute the SQL script to create and initialize the database schema
with open('database/schema.sql') as f:
    connection.executescript(f.read())

# Commit the changes to the database
connection.commit()

# Close the connection to the database
connection.close()
