"""
This module defines the Search class, which handles retrieving and filtering course data from an SQLite database based on specified criteria such as intervenants and branches.

Classes:
    Search: Provides methods for retrieving and filtering course data.

Methods:
    get_data(self, intervenants: list = None, branches: list = None, return_others: bool = False): Retrieves and filters course data based on specified criteria.
    __check_intervenants(self, course, intervenants): Checks if the course intervenants match any of the specified intervenants.
    __check_branches(self, course, branches): Checks if the course branch matches any of the specified branches.
    __get_all_courses(self): Retrieves all courses from the database along with their associated horaires, intervenants, and branches.
"""

import sqlite3

class Search:
    db_info = '../database/database.db'

    def get_data(self, intervenants: list = None, branches: list = None, return_others: bool = False):
        """
        Retrieves and filters course data based on specified criteria.

        Args:
            intervenants (list, optional): List of intervenants to filter by.
            branches (list, optional): List of branches to filter by.
            return_others (bool, optional): Whether to return courses not matching the filters. Defaults to False.

        Returns:
            list: Filtered courses.
            list (optional): Courses not matching the filters if return_others is True.
        """
        other_courses = self.__get_all_courses()
        courses_filtered = []

        # Iterate through the courses
        for course in other_courses[:]:
            if intervenants and self.__check_intervenants(course, intervenants):
                if course in other_courses:
                    other_courses.remove(course)
                    courses_filtered.append(course)
            if branches and self.__check_branches(course, branches):
                if course in other_courses:
                    other_courses.remove(course)
                    courses_filtered.append(course)

        if return_others:
            return courses_filtered, other_courses

        return courses_filtered

    def __check_intervenants(self, course, intervenants):
        """
        Checks if the course intervenants match any of the specified intervenants.

        Args:
            course (dict): Course data.
            intervenants (list): List of intervenants to check against.

        Returns:
            bool: True if there is a match, False otherwise.
        """
        return bool(set(course["intervenants"]).intersection(set(intervenants)))

    def __check_branches(self, course, branches):
        """
        Checks if the course branch matches any of the specified branches.

        Args:
            course (dict): Course data.
            branches (list): List of branches to check against.

        Returns:
            bool: True if there is a match, False otherwise.
        """
        return course["branche"] in branches

    def __get_all_courses(self):
        """
        Retrieves all courses from the database along with their associated horaires, intervenants, and branches.

        Returns:
            list: List of courses with associated data.
        """
        conn = sqlite3.connect(self.db_info)
        conn.row_factory = sqlite3.Row

        cours_rows = conn.execute('SELECT * FROM cours').fetchall()
        cours_dict_list = []

        for row in cours_rows:
            cours_dict = dict(row)

            horaireids_query = '''
                SELECT horaireid
                FROM cours_has_horaire
                WHERE coursid = ?
            '''
            horaireids = conn.execute(horaireids_query, (cours_dict['id'],)).fetchall()
            cours_dict['horaires'] = [horaireid['horaireid'] for horaireid in horaireids]

            intervenants_query = '''
                SELECT intervenant.nom
                FROM intervenant
                INNER JOIN cours_has_intervenant ON intervenant.id = cours_has_intervenant.intervenantid
                WHERE cours_has_intervenant.coursid = ?
            '''
            intervenants = conn.execute(intervenants_query, (cours_dict['id'],)).fetchall()
            cours_dict['intervenants'] = [intervenant['nom'] for intervenant in intervenants]

            branche_query = '''
                SELECT nom
                FROM branche
                WHERE id = ?
            '''
            branche = conn.execute(branche_query, (cours_dict['brancheid'],)).fetchone()
            if branche:
                cours_dict['branche'] = branche['nom']

            cours_dict_list.append(cours_dict)

        conn.close()

        return cours_dict_list
