from Search import Search
from GroupCours import GroupCours

search_obj = Search()

#print(search_obj.get_data(branches=["Français", "Informatique pour les sciences humaines", "Linguistique"]))
for x in search_obj.get_data(branches=["Français", "Informatique pour les sciences humaines", "Linguistique"]):
    print(x["branche"])
""" print(search_obj.get_data()[0]) """

