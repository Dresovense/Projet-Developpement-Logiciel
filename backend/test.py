from Search import Search
from GroupCours import GroupCours
import gensim
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from nltk.tokenize import word_tokenize
import json
import sqlite3

search_obj = Search()
 
#print(search_obj.get_data(branches=["Français", "Informatique pour les sciences humaines", "Linguistique"]))
#GroupCours(search_obj.get_data()).build_model()

cours1, cours2 = search_obj.get_data(branches=["Linguistique", "Informatique pour les Sciences Humaines"], return_others=True)
cours1 = GroupCours(cours1)
cours2 = GroupCours(cours2)

print("this is cours2.similarity")
cours2.similarity(cours1, cluster_type="median")

<<<<<<< HEAD


"""with open("backend\json.json") as f:
    test = json.load(f)
print(test["intervenants"])"""
=======
#with open("backend\json.json") as f:
#    test = json.load(f)
#print(test["intervenants"])
>>>>>>> main

def get_db_connection():
    conn = sqlite3.connect('database/database.db')
    return conn
conn = get_db_connection()
horaires = conn.execute('SELECT id, horaire, jour FROM horaire').fetchall()
print(horaires)