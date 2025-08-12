# In backend/services/vector_db.py
import chromadb
import google.generativeai as genai
import os

# Initialize the ChromaDB client. It will store data in a folder on your disk.
client = chromadb.PersistentClient(path="db/chroma_db")

# Configure the Gemini API for creating embeddings
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def get_or_create_collection(user_id):
    """Get or create a unique collection for each user."""
    collection_name = f"user_{user_id}_notes"
    return client.get_or_create_collection(name=collection_name)

def add_or_update_note(user_id, note_id, note_content):
    """Convert a note to an embedding and store it in the vector DB."""
    if not note_content:
        return
    
    collection = get_or_create_collection(user_id)
    
    # Use the Gemini embedding model
    embedding = genai.embed_content(
        model="models/embedding-001",
        content=note_content,
        task_type="retrieval_document"
    )["embedding"]
    
    collection.upsert(
        ids=[str(note_id)],
        embeddings=[embedding],
        documents=[note_content]
    )
    print(f"Upserted note {note_id} for user {user_id}")

def delete_note(user_id, note_id):
    """Delete a note from the vector DB."""
    collection = get_or_create_collection(user_id)
    collection.delete(ids=[str(note_id)])
    print(f"Deleted note {note_id} for user {user_id}")

def query_notes(user_id, query_text, n_results=3):
    """Query the vector DB to find the most relevant notes."""
    collection = get_or_create_collection(user_id)
    
    # Convert the user's question into an embedding
    query_embedding = genai.embed_content(
        model="models/embedding-001",
        content=query_text,
        task_type="retrieval_query"
    )["embedding"]
    
    # Search the collection for the most similar notes
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results
    )
    
    return results['documents'][0] if results['documents'] else []