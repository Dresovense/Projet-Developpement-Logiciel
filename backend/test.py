from Search import Search
from GroupCours import GroupCours
import gensim
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from nltk.tokenize import word_tokenize
import json

search_obj = Search()
 
#print(search_obj.get_data(branches=["Français", "Informatique pour les sciences humaines", "Linguistique"]))
#GroupCours(search_obj.get_data()).build_model()

cours1, cours2 = search_obj.get_data(branches=["Linguistique", "Histoire"], intervenants=["Davide Picca"], return_others=True)
cours1 = GroupCours(cours1)
cours2 = GroupCours(cours2)

print("this is cours2.similarity")
cours2.similarity(cours1, cluster_type="min")



"""with open("backend\json.json") as f:
    test = json.load(f)
print(test["intervenants"])"""

