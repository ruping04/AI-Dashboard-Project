import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    MYSQL_HOST = os.getenv("MYSQL_HOST")
    MYSQL_USER = os.getenv("MYSQL_USER")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
    MYSQL_DB = os.getenv("MYSQL_DB")
    
    # --- FIX IS HERE ---
    # Change this line:
    # JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY") 
    # To this:
    SECRET_KEY = os.getenv("SECRET_KEY") # Match the name from your .env file

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")