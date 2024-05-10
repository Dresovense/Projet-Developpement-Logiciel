import sqlite3

class Search():
    db_info = 'database/database.db'

    def get_data(self, languages:list = None, credits:list = None, intervenants:list = None, branches:list = None, semester: list = None, horaires:list = None, return_others:bool = False):
        other_courses = self.__get_all_courses()
        courses_filtered = list()

        #iterate through the courses
        for course in other_courses[:]:
            #apply language filter if specified
            if languages:
                if self.__check_languages(course, languages):
                    if course in other_courses:
                        other_courses.remove(course)
                        courses_filtered.append(course)

            #apply credits filter if specified
            if credits:
                if self.__check_credits(course, credits):
                    if course in other_courses:
                        other_courses.remove(course)
                        courses_filtered.append(course)

            #apply intervenants filter if specified
            if intervenants:
                if self.__check_intervenants(course, intervenants):
                    if course in other_courses:
                        other_courses.remove(course)
                        courses_filtered.append(course)

            #apply branches filter if specified
            if branches:
                if self.__check_branches(course, branches):
                    if course in other_courses:
                        other_courses.remove(course)
                        courses_filtered.append(course)

            #apply semester filter if specified
            if semester:
                if self.__check_semesters(course, semester):
                    if course in other_courses:
                        other_courses.remove(course)
                        courses_filtered.append(course)

            #apply horaire filter if specified
            if horaires:
                if self.__check_horaires(course, horaires):
                    if course in other_courses:
                        other_courses.remove(course)
                        courses_filtered.append(course)
        
        if return_others:
            return courses_filtered, other_courses
        
        return courses_filtered
            

    def __check_languages(self, course, languages):
        if course["langage"] in languages:
            return True
        return False
    
    def __check_credits(self, course, credits):
        if course["credits"] in credits:
            return True
        return False
    
    def __check_intervenants(self, course, intervenants):
        # in the case of a list of intervenants in arg, returns true if one of them is in the course["intervenants"]
        if set(course["intervenants"]).intersection(set(intervenants)):
            return True
        return False
    
    def __check_branches(self, course, branches):
        if course["branche"] in branches:
            return True
        return False
    
    def __check_semesters(self, course, semesters):
        if course["semestre"] in semesters:
            return True
        return False
    
    def __check_horaires(self, course, horaires):
        pass
        """ if set(course["horaire"]) in horaires: """

    def __get_all_courses(self):  
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
            
            # Fetch horaireids for the current course
            horaireids_query = '''
                SELECT horaireid
                FROM cours_has_horaire
                WHERE coursid = ?
            '''
            horaireids = conn.execute(horaireids_query, (cours_dict['id'],)).fetchall()
            cours_dict['horaires'] = [horaireid['horaireid'] for horaireid in horaireids]
    
            
            # Fetch intervenants for the current course
            intervenants_query = '''
                SELECT intervenant.nom
                FROM intervenant
                INNER JOIN cours_has_intervenant ON intervenant.id = cours_has_intervenant.intervenantid
                WHERE cours_has_intervenant.coursid = ?
            '''
            intervenants = conn.execute(intervenants_query, (cours_dict['id'],)).fetchall()
            cours_dict['intervenants'] = [intervenant['nom'] for intervenant in intervenants]

            # Fetch the branch name for the current course
            branche_query = '''
                SELECT nom
                FROM branche
                WHERE id = ?
            '''
            branche = conn.execute(branche_query, (cours_dict['brancheid'],)).fetchone()
            if branche:
                cours_dict['branche'] = branche['nom']
            
            # Append the course dictionary to the list
            cours_dict_list.append(cours_dict)
        
        conn.close()

        return cours_dict_list