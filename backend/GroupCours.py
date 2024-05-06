import pandas as pd
import re
import gensim
from sklearn.metrics.pairwise import cosine_similarity
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from nltk.tokenize import word_tokenize
from statistics import mean

class GroupCours():
    def __init__(self, data:list):
        #create dataframe
        self.dataframe = pd.DataFrame(data)

    def similarity(self, group_cours_df):
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
        #print(similarity_matrix)

        #Input similarities in dataframe
        similarity_list = list()
        for vec in similarity_matrix:
            similarity_list.append(mean(vec))
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
            if course['exigences'] != "":
                course_str.append(course['exigences'])
            if course['evaluation'] != "":
                course_str.append(course['evaluation'])
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
        model = gensim.models.doc2vec.Doc2Vec(vector_size=30, min_count=2, epochs=80)
        model.build_vocab(tagged_data)
        model.train(tagged_data, total_examples=model.corpus_count, epochs=80)
        model.save("backend/d2v.model")