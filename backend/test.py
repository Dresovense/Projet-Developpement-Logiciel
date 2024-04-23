from Search import Search
from GroupCours import GroupCours

search_obj = Search()

#print(search_obj.get_data(languages=["allemand"]))
#for x in search_obj.get_data():
#    print(x["intervenants"])

GroupCours(search_obj.get_data())