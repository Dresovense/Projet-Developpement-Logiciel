import sqlite3

class Search():
    db_info = 'database/database.db'

    def get_data(self, languages:list = None, credits:list = None, intervenants:list = None, branches:list = None, semester: list = None):
        courses_filtered = self.get_all_courses()

        #iterate through the courses
        for course in courses_filtered[:]:
            #apply language filter if specified
            if languages:
                if not self.check_languages(course, languages):
                    if course in courses_filtered:
                        courses_filtered.remove(course)

            #apply credits filter if specified
            if credits:
                if not self.check_credits(course, credits):
                    if course in courses_filtered:
                        courses_filtered.remove(course)

            #apply intervenants filter if specified
            if intervenants:
                if not self.check_intervenants(course, intervenants):
                    if course in courses_filtered:
                        courses_filtered.remove(course)

            #apply branches filter if specified
            if branches:
                if not self.check_branches(course, branches):
                    if course in courses_filtered:
                        courses_filtered.remove(course)

            #apply branches filter if specified
            if semester:
                if not self.check_semesters(course, semester):
                    if course in courses_filtered:
                        courses_filtered.remove(course)
        
        return courses_filtered

    def check_languages(self, course, languages):
        if course["langage"] in languages:
            return True
        return False
    
    def check_credits(self, course, credits):
        if course["credits"] in credits:
            return True
        return False
    
    def check_intervenants(self, course, intervenants):
        # return true seulement si x et y donnent le cours (et non x ou y)
        # changer pour set(course["intervenants"]).intersection(set(intervenants)) si on souhaite afficher donnés par x ou y
        if set(course["intervenants"]) >= set(intervenants):
            return True
        return False
    
    def check_branches(self, course, branches):
        if course["branche"] in branches:
            return True
        return False
    
    def check_semesters(self, course, semesters):
        if course["semestre"] in semesters:
            return True
        return False

    def get_all_courses(self):  
        #database connection
        conn = sqlite3.connect(self.db_info)

        # Set the row factory to sqlite3.Row
        conn.row_factory = sqlite3.Row

        # Fetch all rows from the 'cours' table
        cours_rows = conn.execute('SELECT * FROM cours').fetchall()

        # Initialize a list to store the dictionaries
        cours_dict_list = []

        # Iterate over each course row
        for row in cours_rows:
            # Create a dictionary for the current course
            cours_dict = dict(row)
            
            # Fetch horaires for the current course
            horaires_query = '''
                SELECT horaire
                FROM horaire
                INNER JOIN cours_has_horaire ON horaire.id = cours_has_horaire.horaireid
                WHERE cours_has_horaire.coursid = ?
            '''
            horaires = conn.execute(horaires_query, (cours_dict['id'],)).fetchall()
            cours_dict['horaires'] = [horaire['horaire'] for horaire in horaires]
            
            # Fetch intervenants for the current course
            intervenants_query = '''
                SELECT intervenant.nom
                FROM intervenant
                INNER JOIN cours_has_intervenant ON intervenant.id = cours_has_intervenant.intervenantid
                WHERE cours_has_intervenant.coursid = ?
            '''
            intervenants = conn.execute(intervenants_query, (cours_dict['id'],)).fetchall()
            cours_dict['intervenants'] = [intervenant['nom'] for intervenant in intervenants]
            
            # Append the course dictionary to the list
            cours_dict_list.append(cours_dict)
        
        conn.close()

        return cours_dict_list