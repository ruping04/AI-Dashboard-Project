import os
import base64 # We need this to send the image data
from flask import Blueprint, request, jsonify

# Text generation with Gemini
import google.generativeai as genai

# Image generation with Imagen (Vertex AI)
import vertexai
from vertexai.preview.vision_models import ImageGenerationModel
import requests 
from bs4 import BeautifulSoup
from services.vector_db import query_notes

ai_bp = Blueprint('ai', __name__)

# --- SUMMARIZER FUNCTION (No changes needed here) ---
@ai_bp.route('/summarize', methods=['POST'])
def summarize_text():
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables.")
        genai.configure(api_key=api_key)
        
        data = request.get_json()
        text_to_summarize = data.get('text')
        user_id = data.get('user_id') # ✅ Get the user_id from the request

        # Debugging print statement
        print(f"Summarize request received for user_id: {user_id}")

        if not text_to_summarize:
            return jsonify({"error": "Text is required"}), 400

        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        prompt = f"Please provide a concise, bullet-point summary of the following text:\n\n---\n\n{text_to_summarize}"
        response = model.generate_content(prompt)
        
        summary = response.text
        return jsonify({"summary": summary})

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500

# ... (keep your generate_image function) ...


# --- ✅ IMAGE GENERATOR FUNCTION (Updated for Google Imagen) ---
@ai_bp.route('/generate-image', methods=['POST'])
def generate_image():
    try:
        # --- IMPORTANT: REPLACE WITH YOUR PROJECT ID ---
        project_id = "your-google-cloud-project-id-here" 
        
        # Initialize Vertex AI
        vertexai.init(project=project_id, location="us-central1")

        data = request.get_json()
        prompt = data.get('prompt')

        if not prompt:
            return jsonify({"error": "A text prompt is required"}), 400

        # Load the Imagen model
        model = ImageGenerationModel.from_pretrained("imagegeneration@006") # Using the latest model

        # Generate the image
        response = model.generate_images(
            prompt=prompt,
            number_of_images=1,
        )

        # The model gives us raw image data (bytes). We need to convert it
        # into a format the browser can display (a base64 data URL).
        image_bytes = response.images[0]._image_bytes
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        image_url = f"data:image/png;base64,{base64_image}"

        return jsonify({"image_url": image_url})

    except Exception as e:
        print(f"An error occurred with the Imagen API: {e}")
        return jsonify({"error": "Failed to generate image from AI"}), 500
    
@ai_bp.route('/scrape-and-summarize', methods=['POST'])
def scrape_and_summarize():
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({"error": "URL is required"}), 400

    try:
        # Step 1: Scrape the webpage content
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)

        # Step 2: Parse the HTML and extract text
        soup = BeautifulSoup(response.content, 'html.parser')
        # This is a simple heuristic: find all paragraph tags and join their text.
        # It works well for many articles and blogs.
        paragraphs = soup.find_all('p')
        scraped_text = ' '.join([p.get_text() for p in paragraphs])

        if not scraped_text.strip():
            return jsonify({"error": "Could not find any readable text on that page."}), 400

        # Step 3: Summarize the extracted text using Gemini
        # (This part reuses your existing Gemini setup)
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found.")
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        prompt = f"Please provide a concise, high-quality summary of the following article text:\n\n---\n\n{scraped_text}"
        summary_response = model.generate_content(prompt)
        
        summary = summary_response.text
        return jsonify({"summary": summary})

    except requests.RequestException as e:
        print(f"Error fetching URL: {e}")
        return jsonify({"error": "Failed to fetch the webpage. Please check the URL."}), 500
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500
    
@ai_bp.route('/expand-content', methods=['POST'])
def expand_content():
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables.")
        
        genai.configure(api_key=api_key)
        
        data = request.get_json()
        text_to_expand = data.get('text')

        if not text_to_expand:
            return jsonify({"error": "Text to expand is required"}), 400

        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        
        # This prompt instructs the AI to act as a professional writer
        prompt = f"You are a professional content writer. Expand the following idea or bullet points into a well-written, coherent paragraph:\n\n---\n\n{text_to_expand}"
        
        response = model.generate_content(prompt)
        expanded_content = response.text
        
        return jsonify({"expanded_content": expanded_content})

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500
    

@ai_bp.route('/chat-with-notes', methods=['POST'])
def chat_with_notes():
    try:
        data = request.get_json()
        query = data.get('query')
        user_id = data.get('user_id')

        if not query or not user_id:
            return jsonify({"error": "Query and User ID are required"}), 400
        
        # Step 1: Find relevant notes from the vector DB
        context_docs = query_notes(user_id, query)
        
        if not context_docs:
            return jsonify({"answer": "I couldn't find any relevant information in your notes to answer that question."})
        
        # Step 2: Prepare the context and prompt for Gemini
        context = "\n\n".join(context_docs)
        prompt = f"""You are a helpful AI assistant. Based ONLY on the following context from the user's notes, please answer their question. If the context doesn't contain the answer, say that you couldn't find the information in their notes.

        CONTEXT FROM NOTES:
        ---
        {context}
        ---

        USER'S QUESTION:
        {query}
        """

        # Step 3: Call Gemini to generate the final answer
        api_key = os.getenv("GOOGLE_API_KEY")
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        
        response = model.generate_content(prompt)
        answer = response.text

        return jsonify({"answer": answer})

    except Exception as e:
        print(f"An error occurred in chat-with-notes: {e}")
        return jsonify({"error": str(e)}), 500