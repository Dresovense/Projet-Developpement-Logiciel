import pandas as pd
import re
import gensim
from sklearn.metrics.pairwise import cosine_similarity
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from nltk.tokenize import word_tokenize
from statistics import mean, median

class GroupCours():
    def __init__(self, data:list):
        #create dataframe
        self.dataframe = pd.DataFrame(data)
        print(self.dataframe)

    def similarity(self, group_cours_df, cluster_type:str = "mean"):

        # Example documents

        corpus_wanted = self.dataframe['nom'].to_list() #list of the classes we want to test the similarity for
        corpus_query = group_cours_df.dataframe['nom'].to_list()  #list of the classes we want to base the similiarity on


        #load model
        model = Doc2Vec.load("backend/d2v.model")

        # Infer vectors for user-selected documents
        wanted_vecs = [model.infer_vector(word_tokenize(doc.lower())) for doc in corpus_wanted]

        # Infer vectors for all other documents
        query_vecs = [model.infer_vector(word_tokenize(doc.lower())) for doc in corpus_query]

        # Compute cosine similarity
        similarity_matrix = cosine_similarity(wanted_vecs, query_vecs)

        # Output the similarities (each row corresponds to a user doc, each column to an other doc)
        print(f"Wanted vecs: {len(wanted_vecs)}")
        print(f"Query vecs : {len(query_vecs)}")
        print(f"Similairty matrix: {len(similarity_matrix)}")

        #Input similarities in dataframe
        similarity_list = list()
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

        print(self.dataframe[['nom', 'similarity']].head(10))
        print(self.dataframe.nlargest(10, 'similarity'))

    def send_data(self):
        pass

    def export_data(self, type="csv"):
        pass

    def build_model(self):
        #create corpus
        corpus = dict()
        for _, course in self.dataframe.iterrows():
            course_str = list()
            if course['objectif'] != "":
                course_str.append(course['objectif'])
            if course['contenu'] != "":
                course_str.append(course['contenu'])
            course_str = "\n".join(course_str)
            #clean string
            course_str = re.sub(r'\s+', ' ', re.sub(r'\xa0|\*\*\*', '', course_str.strip()))
            #add to corpus
            corpus[course['nom']] = course_str

        #print(corpus)
        
        #tag data
        tagged_data = list()
        for key, value in corpus.items():
            tagged_data.append(TaggedDocument(words=word_tokenize(value.lower()), tags=[key]))
        print(tagged_data)

        #build model
        model = gensim.models.doc2vec.Doc2Vec(vector_size=50, min_count=1, epochs=40)
        model.build_vocab(tagged_data)
        model.train(tagged_data, total_examples=model.corpus_count, epochs=80)
        model.save("backend/d2v.model")