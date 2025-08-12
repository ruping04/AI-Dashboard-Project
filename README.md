# AI Productivity Dashboard ✨

A full-stack, multi-tool web application designed to leverage the power of generative AI for a suite of productivity tasks. This dashboard provides an integrated environment for intelligent note-taking, content creation, and data processing, all powered by Google's Gemini and Vertex AI models.



---

## 🚀 Key Features

* **Secure User Authentication:** Standard login/register system with hashed password storage.
* **AI Notes System:** A complete note-taking application with full CRUD (Create, Read, Update, Delete) functionality.
    * **Full-Text Search:** Instantly search through the title and content of all notes.
    * **Tagging System:** Organize notes with custom tags and filter by them.
* **Chat with Your Notes (RAG):** An advanced AI assistant that answers questions based on the content of your saved notes, using a ChromaDB vector database for semantic search.
* **AI Content Tools:**
    * **Text Summarizer:** Condenses long texts into concise, bullet-point summaries.
    * **Content Writer:** Expands simple ideas or bullet points into full, well-written paragraphs.
* **Web Article Summarizer:** A powerful tool that scrapes the content from a URL and provides a summary, saving you reading time.
* **Modern, Animated UI:** A professional and responsive interface built with Tailwind CSS and brought to life with smooth animations from Framer Motion.

---

## 🛠️ Tech Stack

| Category      | Technology                                                                                                   |
|---------------|--------------------------------------------------------------------------------------------------------------|
| **Frontend** | React, React Router, Framer Motion, Axios, Tailwind CSS                                                      |
| **Backend** | Python, Flask                                                                                                |
| **Database** | MySQL, ChromaDB (Vector Database)                                                                            |
| **AI Services** | Google Gemini API (Text Generation, Embeddings), Google Vertex AI (Imagen for Image Generation)                |
| **DevOps** | Git, GitHub                                                                                                  |

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Python (3.9+)
* Node.js and npm
* Git
* A running MySQL server

### Backend Setup

1.  Clone the repository:
    ```sh
    git clone [https://github.com/ruping04/AI-Dashboard-Project.git](https://github.com/ruping04/AI-Dashboard-Project.git)
    cd AI-Dashboard-Project/backend
    ```
2.  Create and activate a virtual environment:
    ```sh
    # For Windows
    python -m venv venv
    .\venv\Scripts\activate
    ```
3.  Install the required Python packages:
    ```sh
    pip install -r requirements.txt
    ```
4.  Set up your environment variables:
    * Create a file named `.env` in the `backend` folder.
    * Copy the contents of `.env.example` (if you have one) or add the following, filling in your own credentials:
        ```ini
        MYSQL_USER=your_mysql_user
        MYSQL_PASSWORD=your_mysql_password
        MYSQL_HOST=localhost
        MYSQL_DB=smart_notes
        GOOGLE_API_KEY=your_gemini_api_key
        # You'll also need to set up Google Cloud Authentication for Vertex AI
        ```
5.  Run the Flask application:
    ```sh
    python app.py
    ```

### Frontend Setup

1.  Navigate to the frontend directory in a new terminal:
    ```sh
    cd AI-Dashboard-Project/frontend
    ```
2.  Install NPM packages:
    ```sh
    npm install
    ```
3.  Start the React development server:
    ```sh
    npm start
    ```
The application should now be running on `http://localhost:3000`.

---
## 🔮 Future Improvements

* **AI Code Assistant:** A tool to generate and explain code snippets.
* **Speech-to-Text Transcriber:** Upload audio files and receive a text transcription.
* **Enhanced Image Generator:** Add features like style selection, negative prompts, and aspect ratios.
