
"""
This module defines the UnilScrape class, which is used to scrape course data from the University of Lausanne (UNIL) website and store it in an SQLite database.

Classes:
    UnilScrape: Provides methods for scraping and storing course data.

Attributes:
    JOURS (list): A list of days of the week.

Methods:
    __init__(self, database: str, faculte: str): Initializes the UnilScrape object with the specified database and faculty.
    scrape(self, url: str, plages: list = [], exclude: list = []): Scrapes course data from the given URL, specifying time slots and exclusions if provided.
    cours_to_database(self, cours_dict: dict): Inserts course data into the database.
    branches_to_database(self, branche: str): Inserts branch data into the database.
    create_horaires(self, plages: list): Creates time slots in the database.
    close_db_connection(self): Commits changes to the database and closes the connection.

"""

import sqlite3
import requests
from bs4 import BeautifulSoup
import re

class UnilScrape:
    JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"]

    def __init__(self, database: str, faculte: str):
        """
        Initializes the UnilScrape object with the specified database and faculty.

        Args:
            database (str): The path to the SQLite database file.
            faculte (str): The name of the faculty.

        Returns:
            None
        """
        self.database = database
        self.faculte = faculte
        # Connect to db
        self.connection = sqlite3.connect(self.database)
        self.cur = self.connection.cursor()

    def scrape(self, url: str, plages: list = [], exclude: list = []):
        """
        Scrapes course data from the given URL, specifying time slots and exclusions if provided.

        Args:
            url (str): The URL of the webpage containing course information.
            plages (list, optional): List of time slots to scrape. Defaults to an empty list.
            exclude (list, optional): List of branches to exclude. Defaults to an empty list.

        Returns:
            None
        """
        # Set default time slots if not provided
        if plages == []:
            plages = ["08:30", "09:15", "10:15", "11:15", "12:30", "13:15", "14:15", "15:15", "16:15", "17:15"]
        # Set default exclusions if not provided
        if exclude == []:
            exclude = ["Hors branche Lettres", "Pluridiscipline"]
        
        # Setup time slots in the database
        self.create_horaires(plages)

        # Clear content from the log file
        open('database\wrong_format.txt', 'w').close()
        
        # Get the webpage content
        website_request = requests.get(url)
        website_parsed = BeautifulSoup(website_request.content, 'html.parser')

        # Extract branches and links
        results_td = website_parsed.find_all('td')
        branche_dict = dict()
        current_branche = ""
        for td in results_td:
            try:
                if td['class'][0] == "etapeTitle":
                    branche_dict[td.contents[1].text] = list()
                    current_branche = td.contents[1].text
            except KeyError:
                pass
            try:
                if td.contents[0].attrs['title'] == "Liste des cours":
                    branche_dict[current_branche].append(td.contents[0]['href'])
            except (KeyError, AttributeError, IndexError):
                pass

        # Loop through each branch and its list of blocks
        for branche, bloc_list in branche_dict.items():
            # Check if the branch should be excluded
            if branche not in exclude:
                # Insert branch into the database
                self.branches_to_database(branche)
                print(f"-----------------{branche}--------------------")
                # Loop through each block in the branch
                for bloc in bloc_list:
                    # Get all the classes in the block
                    bloc_website = requests.get(f"https://applicationspub.unil.ch/interpub/noauth/php/Ud/{bloc}")
                    bloc_website_parsed = BeautifulSoup(bloc_website.content, 'html.parser')
                    # Get a partial list of class URLs
                    courses = bloc_website_parsed.find_all('li')[18:]

                    # Loop through each course
                    for cours in courses:
                        try:
                            # Extract course URL
                            cours_url = f"https://applicationspub.unil.ch/interpub/noauth/php/Ud/ficheCours.php?v_enstyid={cours.find('a')['onclick'][38:43]}&v_ueid=174&v_etapeid1=30425&v_langue=fr&v_isinterne=1"
                            # Scrape course details
                            cours_website = requests.get(cours_url) 
                            cours_website_parsed = BeautifulSoup(cours_website.content, 'html.parser')

                            # Initialize dictionary to store course data
                            class_dict = {}

                            # Extract course name
                            class_dict['name'] = cours_website_parsed.find('h2').text

                            # Extract course URL
                            class_dict['url'] = cours_url

                            # Extract credits
                            re_credits = re.compile('(?<=Crédits: )[\d|.]+')
                            class_dict['credits'] = re_credits.search(cours_website_parsed.find_all('p')[1].text).group()
                            
                            # Extract language
                            re_lang = re.compile("(?<=Langue\(s\) d'enseignement: )[\wç]+")
                            class_dict['lang'] = re_lang.search(cours_website_parsed.find_all('p')[1].text).group()
                            
                            # Extract objective, content, evaluation, and requirements
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
                            

                            # Extract semester
                            re_semestre = re.compile("\w+?(?=\\n)")
                            class_dict['semestre'] = re_semestre.search(cours_website_parsed.find_all('p')[1].text).group()

                            # Extract professors and class schedules
                            td_list = cours_website_parsed.find_all('table')[0].find_all('td')
                            class_dict['profs'] = []
                            class_dict['horaires'] = []
                            for i, td in enumerate(td_list):
                                # Extract professors
                                if i % 5 == 4:
                                    result = [x.strip() for x in td.text.split(',')]
                                    class_dict['profs'] = list(set(class_dict['profs'] + result))
                                # Extract class schedules
                                if i % 5 == 0:
                                    jour = re.findall("\w+", td.text)[2]
                                    heure = re.findall("\d+:\d+",td.text)
                                    
                                    class_start = heure[0]
                                    class_end = heure[1]

                                    # Convert class start and end times to minutes for easier comparison
                                    class_start_minutes = int(class_start.split(":")[0]) * 60 + int(class_start.split(":")[1])
                                    class_end_minutes = int(class_end.split(":")[0]) * 60 + int(class_end.split(":")[1])

                                    # Iterate through the time slots and add times that fall within the class period
                                    class_times = []
                                    for time in plages:
                                        time_minutes = int(time.split(":")[0]) * 60 + int(time.split(":")[1])
                                        if class_start_minutes <= time_minutes < class_end_minutes:
                                            class_times.append(time)


                                    class_dict['horaires'].append((jour, tuple(class_times)))
                            class_dict['horaires'] = list(set(class_dict['horaires']))

                            # Add branch information
                            class_dict['branche'] = branche

                            # Save course data to the database
                            self.cours_to_database(class_dict)

                            print(class_dict['name'])
                        except AttributeError:
                            print(f"This class does not exist: {cours_url}")
                        except (IndexError, TypeError):
                            print(f"The class has a wrong Format: {cours_url}")
                            with open('database\wrong_format.txt', "a", encoding="utf-8") as f:
                                f.write(f"{cours_url}\n")
                        except Exception as e:
                            print(e, cours_url)
                            exit()

    def cours_to_database(self, cours_dict:dict):
        """
        Inserts course data into the database.

        Args:
            cours_dict (dict): A dictionary containing course information.

        Returns:
            None
        """
        # Get the ID of the branch
        self.cur.execute("SELECT id FROM branche WHERE nom=?", (cours_dict['branche'],))
        brancheid = self.cur.fetchone()[0]

        # Insert course data
        self.cur.execute("INSERT OR IGNORE INTO cours (nom, credits, langage, objectif, contenu, exigences, evaluation, semestre, url, brancheid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (cours_dict['name'], cours_dict['credits'], cours_dict['lang'], cours_dict['objectif'], cours_dict['contenu'], cours_dict['exigences'],
                    cours_dict['evaluation'], cours_dict['semestre'], cours_dict['url'], brancheid)
                    )
        coursid = self.cur.lastrowid

        # Insert professors
        for prof in cours_dict['profs']:
            self.cur.execute("INSERT OR IGNORE INTO intervenant (nom) VALUES (?)", (prof,))
            self.cur.execute("SELECT id FROM intervenant WHERE nom =?", (prof, ))
            profid = self.cur.fetchone()[0]
            self.cur.execute("INSERT OR IGNORE INTO cours_has_intervenant (intervenantid, coursid, brancheid) VALUES (?, ?, ?)",
                            (profid, coursid, brancheid)
                        )
        
        # Insert class schedule
        for horaire in cours_dict['horaires']:
            for class_begin in horaire[1]:
                self.cur.execute("SELECT id FROM horaire WHERE horaire =? AND jour =?", (class_begin, horaire[0]))
                id_horaire = self.cur.fetchone()[0]
                self.cur.execute("INSERT OR IGNORE INTO cours_has_horaire (coursid, horaireid, brancheid) VALUES (?, ?, ?)",
                            (coursid, id_horaire, brancheid)
                            )

    
    def branches_to_database(self, branche:str):
        """
        Inserts branch data into the database.

        Args:
            branche (str): The name of the branch.

        Returns:
            None
        """
        # Insert branch data
        self.cur.execute("INSERT OR IGNORE INTO branche (nom, faculte) VALUES (?, ?)",
                    (branche, self.faculte)
                    )

    def create_horaires(self, plages:list):
        """
        Creates time slots (horaires) in the database.

        Args:
            plages (list): List of time slots.

        Returns:
            None
        """
        # Create time slots for each day of the week
        for jour in UnilScrape.JOURS:
            for plage in plages:
                self.cur.execute("INSERT OR IGNORE INTO horaire (horaire, jour) VALUES (?, ?)",
                    (plage, jour)
                    )

    def close_db_connection(self):
        """
        Commits changes to the database and closes the connection.

        Returns:
            None
        """
        # Commit changes and close the database connection
        self.connection.commit()
        self.connection.close()

