from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document  # Import the Document class
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain.embeddings import HuggingFaceEmbeddings
from langchain_cohere import CohereEmbeddings
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import csv

load_dotenv()

# Directory setup



        
# Load and process documents using PyPDFLoader
documents = []
with open("internship.csv", mode='r', encoding='utf-8') as file:
    reader = csv.reader(file)
    for row in reader:
        # Convert the row (list) into a string
        row_string = ' '.join(row)
        # Create a Document with the string content
        document = Document(page_content=row_string)
        documents.append(document)


embeddings = CohereEmbeddings(model = "embed-english-light-v3.0")
# MongoDB setup
client = MongoClient(os.getenv("MONGODB_URI"))
collection = client["Internships"]["Jobs"]

# Create MongoDB Atlas Vector Search
vector_store = MongoDBAtlasVectorSearch.from_documents(
    documents=documents,
    embedding=embeddings,
    collection=collection,
    index_name="resume_index"
)

