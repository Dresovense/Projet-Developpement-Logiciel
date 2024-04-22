from Search import Search

search_obj = Search()

#print(search_obj.get_data(languages=["allemand"]))
for x in search_obj.get_data():
    print(x["langage"])