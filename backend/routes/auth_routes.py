from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_db

auth_bp = Blueprint('auth', __name__)

# ✅ Register route
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    db = get_db()
    # --- IMPROVEMENT ---
    with db.cursor() as cursor:
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({"message": "User already exists"}), 409

        hashed_password = generate_password_hash(password)
        cursor.execute("INSERT INTO users (email, password) VALUES (%s, %s)", (email, hashed_password))
    
    db.commit()
    return jsonify({"message": "User registered successfully"}), 201


# ✅ Login route
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    db = get_db()
    # --- IMPROVEMENT ---
    with db.cursor() as cursor:
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

    if not user or not check_password_hash(user['password'], password):
        return jsonify({"message": "Invalid credentials"}), 401
    
    # On success: You will need to implement JWT properly later
    return jsonify({
        "message": "Login successful",
        "token": "dummy_token_for_now",
        "user_id": user['id']
    }), 200