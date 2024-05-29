"""
This module defines the GroupCours class, which handles course data and calculates similarities between courses using a Doc2Vec model. It also provides functionality to export data and build a new Doc2Vec model.

Classes:
    GroupCours: Manages course data, calculates similarities, exports data, and builds Doc2Vec models.

Methods:
    __init__(self, data: list): Initializes the GroupCours object with course data.
    similarity(self, group_cours_df, cluster_type: str = "mean"): Calculates similarity between courses.
    send_data(self): Placeholder method for future data sending functionality.
    export_data(self, filename: str, type: str = "xlsx"): Exports course data to a file.
    build_model(self): Builds a new Doc2Vec model using course data.
"""

import pandas as pd
import re
import gensim
from sklearn.metrics.pairwise import cosine_similarity
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from nltk.tokenize import word_tokenize
from statistics import mean, median

class GroupCours:
    def __init__(self, data: list):
        """
        Initializes the GroupCours object with course data.

        Args:
            data (list): List of course data dictionaries.
        """
        self.dataframe = pd.DataFrame(data)
        print(self.dataframe)

    def similarity(self, group_cours_df, cluster_type: str = "mean"):
        """
        Calculates similarity between courses using a Doc2Vec model and cosine similarity.

        Args:
            group_cours_df (GroupCours): Another GroupCours object containing courses to compare against.
            cluster_type (str, optional): Method to aggregate similarities ('mean', 'max', 'min', 'median'). Defaults to "mean".

        Raises:
            Exception: If an invalid cluster_type is provided.
        """
        # Extract course names
        corpus_wanted = self.dataframe['nom'].to_list()
        corpus_query = group_cours_df.dataframe['nom'].to_list()

        # Load the pre-trained Doc2Vec model
        model = Doc2Vec.load("backend/d2v.model")

        # Infer vectors for user-selected and query documents
        wanted_vecs = [model.infer_vector(word_tokenize(doc.lower())) for doc in corpus_wanted]
        query_vecs = [model.infer_vector(word_tokenize(doc.lower())) for doc in corpus_query]

        # Compute cosine similarity matrix
        similarity_matrix = cosine_similarity(wanted_vecs, query_vecs)

        # Aggregate similarities based on the specified cluster type
        similarity_list = []
        for vec in similarity_matrix:
            if cluster_type == "mean":
                similarity_list.append(mean(vec))
            elif cluster_type == "max":
                similarity_list.append(max(vec))
            elif cluster_type == "min":
                similarity_list.append(min(vec))
            elif cluster_type == "median":
                similarity_list.append(median(vec))
            else:
                raise Exception(f"{cluster_type} is not an acceptable string")
        
        self.dataframe = self.dataframe.assign(similarity=similarity_list)
        self.dataframe = self.dataframe.sort_values(by=['similarity'])

        print(self.dataframe[['nom', 'similarity']].head(10))
        print(self.dataframe.nlargest(10, 'similarity'))

        self.export_data("my_results", "xlsx")

    def export_data(self, filename: str, type: str = "xlsx"):
        """
        Exports course data to a file.

        Args:
            filename (str): Name of the file to export.
            type (str, optional): Type of the file to export ('xlsx' or 'csv'). Defaults to "xlsx".
        """
        if type == "xlsx":
            self.dataframe.to_excel(f"{filename}.xlsx", columns=["nom", "langage", "credits", "url", "similarity", "prog_op"])
        elif type == "csv":
            self.dataframe.to_csv(f"{filename}.csv", columns=["nom", "langage", "credits", "url", "similarity", "prog_op"])

    def build_model(self):
        """
        Builds a new Doc2Vec model using course data.
        """
        # Create corpus from course data
        corpus = {}
        for _, course in self.dataframe.iterrows():
            course_str = []
            if course['objectif']:
                course_str.append(course['objectif'])
            if course['contenu']:
                course_str.append(course['contenu'])
            course_str = "\n".join(course_str)
            course_str = re.sub(r'\s+', ' ', re.sub(r'\xa0|\*\*\*', '', course_str.strip()))
            corpus[course['nom']] = course_str

        # Tag data for Doc2Vec
        tagged_data = [TaggedDocument(words=word_tokenize(value.lower()), tags=[key]) for key, value in corpus.items()]
        print(tagged_data)

        # Build and train the Doc2Vec model
        model = gensim.models.doc2vec.Doc2Vec(vector_size=50, min_count=1, epochs=40)
        model.build_vocab(tagged_data)
        model.train(tagged_data, total_examples=model.corpus_count, epochs=80)
        model.save("backend/d2v.model")
