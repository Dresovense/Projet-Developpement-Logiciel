import sqlite3

class Search():
    db_info = 'database/database.db'

    def get_data(self, languages:list = None):
        courses_filtered = self.get_all_courses()

        #iterate through the courses
        for course in courses_filtered[:]:
            #apply language filter if specified
            if languages:
                if not self.check_languages(course, languages):
                    courses_filtered.remove(course)
        
        return courses_filtered

    def check_languages(self, course, languages):
        if course["langage"] in languages:
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