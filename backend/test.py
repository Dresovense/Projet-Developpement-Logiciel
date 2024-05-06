from Search import Search
from GroupCours import GroupCours
import gensim
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from nltk.tokenize import word_tokenize

search_obj = Search()

#print(search_obj.get_data(branches=["Français", "Informatique pour les sciences humaines", "Linguistique"]))
#GroupCours(search_obj.get_data()).build_model()

cours1, cours2 = search_obj.get_data(intervenants=["Isaac Pante"])
cours1 = GroupCours(cours1)
cours2 = GroupCours(cours2)

cours2.similarity(cours1)
