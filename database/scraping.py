import requests
from bs4 import BeautifulSoup
import re

branches = ["Allemand", "Anglais", "Archéologie", "Espagnol", "Etudes théologiques", "Français langue étrangère", "Français médiéval", "Français Moderne", "Géographie", "Grec ancien", "Histoire",
            "Histoire ancienne", "Histoire de l'art", "Histoire et esthétique du cinéma", "Histoire et sciences des religions", "Hors branche lettres", "Informatique pour les sciences humaines",
             "Italien", "Langues et civilisations d'Asie du Sud", "Langues et civilisations slaves", "Latin", "Linguistique", "Philosophie", "Pluridiscipline", "Psychologie", "Science politique", "Sciences des religions", "Sciences sociales"]

website = requests.get("https://applicationspub.unil.ch/interpub/noauth/php/Ud/index.php?v_isinterne=1&v_langue=fr&v_ueid=174")
websiteParsed = BeautifulSoup(website.content, 'html.parser')

results_a = websiteParsed.find_all('a')
filtered_results = list()
for a in results_a:
    try:
        if a.attrs['title'] == "Liste des cours":
            filtered_results.append(a['href'])
    except:
        pass

for liste_de_cours in filtered_results[:1]: #-> ici on limite aux 2 premieres listes pour pas devoir passer à énormément d'un coup
    #print(liste_de_cours)
    liste_cours_website = requests.get(f"https://applicationspub.unil.ch/interpub/noauth/php/Ud/{liste_de_cours}")
    liste_cours_website_parsed = BeautifulSoup(liste_cours_website.content, 'html.parser')
    results_li = liste_cours_website_parsed.find_all('li')[18:]
    #print(results_li[0].find('a')['onclick'])
    for cours_url in results_li:
        #Entrée dans la liste des cours -> commencer à scrape
        url = f"https://applicationspub.unil.ch/interpub/noauth/php/Ud/ficheCours.php?v_enstyid={cours_url.find('a')['onclick'][38:43]}&v_ueid=174&v_etapeid1=30425&v_langue=fr&v_isinterne=1"
        cours_website = requests.get(url) 
        cours_website_parsed = BeautifulSoup(cours_website.content, 'html.parser')  

        #init dict
        class_dict = {}

        """ #name:
        class_dict['name'] = cours_website_parsed.find('h2').text

        #url
        class_dict['url'] = url


        #credits
        re_credits = re.compile('(?<=Crédits: )[\d|.]+')
        class_dict['credits'] = re_credits.search(cours_website_parsed.find_all('p')[1].text).group()
        
        #language
        re_lang = re.compile("(?<=Langue\(s\) d'enseignement: )[\wç]+")
        class_dict['lang'] = re_lang.search(cours_website_parsed.find_all('p')[1].text).group()
        
        #objectif / contenu / evaluation / exigences
        body = cours_website_parsed.body
        objectif_found = False
        objectif = ""
        contenu_found = False
        contenu = ""
        evaluation_found = False
        evaluation = ""
        exigences_found = False
        exigences = ""
        for tag in body.contents[1].contents[17].contents[3].contents[1]:
            if tag.name == "h3" or tag.name == "table":
                objectif_found = False
                contenu_found = False
                evaluation_found = False
                exigences_found = False
            if tag.text == "Objectif":
                objectif_found = True
            if tag.text == "Contenu":
                contenu_found = True
            if tag.text == "Evaluation":
                evaluation_found = True
            if tag.text == "Exigences du cursus d'études":
                exigences_found = True
                
                
            if objectif_found is True and tag.text != "Objectif":
                objectif += tag.text
            if contenu_found is True and tag.text != "Contenu":
                contenu += tag.text
            if evaluation_found is True and tag.text != "Evaluation":
                evaluation += tag.text
            if exigences_found is True and tag.text != "Exigences du cursus d'études":
                exigences += tag.text
        class_dict['objectif'] = objectif
        class_dict['contenu'] = contenu
        class_dict['evaluation'] = evaluation
        class_dict['exigences'] = exigences
        

        #semestre
        re_semestre = re.compile("\w+?(?=\\n)")
        class_dict['semestre'] = re_semestre.search(cours_website_parsed.find_all('p')[1].text).group() """

        td_list = cours_website_parsed.find_all('table')[0].find_all('td')
        class_dict['profs'] = []
        class_dict['horaires'] = []
        for i, td in enumerate(td_list):
            """ #profs
            if i % 5 == 4:
                result = [x.strip() for x in td.text.split(',')]
                class_dict['profs'] = list(set(class_dict['profs'] + result)) """
            #horaires
            if i % 5 == 0:
                jour = re.findall("\w+", td.text)[2]
                heure = re.findall("\d+:\d+",td.text)

                plages = ["08:30", "09:15", "10:15", "11:15", "12:30", "13:15", "14:15", "15:15", "16:15", "17:15"]
                class_start = heure[0]
                class_end = heure[1]

                # Convert class start and end times to minutes for easier comparison
                class_start_minutes = int(class_start.split(":")[0]) * 60 + int(class_start.split(":")[1])
                class_end_minutes = int(class_end.split(":")[0]) * 60 + int(class_end.split(":")[1])

                # Iterate through the plages list and add times that fall within the class period
                class_times = []
                for time in plages:
                    time_minutes = int(time.split(":")[0]) * 60 + int(time.split(":")[1])
                    if class_start_minutes <= time_minutes < class_end_minutes:
                        class_times.append(time)


                class_dict['horaires'].append((jour, tuple(class_times)))
        class_dict['horaires'] = list(set(class_dict['horaires']))
        
        print(class_dict['horaires'])



        

        print(class_times)


