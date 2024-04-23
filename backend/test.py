from Search import Search

search_obj = Search()

#print(search_obj.get_data(languages=["allemand"]))
#for x in search_obj.get_data():
#    print(x["intervenants"])

print(search_obj.get_data(intervenants=["Sylvian Fachard", "Matthieu Demierre"]))