from flask import Blueprint, request, jsonify
from db import get_db
from services.vector_db import add_or_update_note, delete_note # Make sure this import is here

note_bp = Blueprint('notes', __name__)

# --- CREATE a new note ---
@note_bp.route('', methods=['POST'])
def create_note():
    data = request.get_json()
    user_id = data.get('user_id')
    title = data.get('title', 'Untitled')
    content = data.get('content')
    tags = data.get('tags', '')
    summary = ' '.join(content.split(' ')[:15]) + '...' if content else ''
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute(
            "INSERT INTO notes (user_id, title, content, summary, tags) VALUES (%s, %s, %s, %s, %s)",
            (user_id, title, content, summary, tags)
        )
        note_id = cursor.lastrowid
    db.commit()
    add_or_update_note(user_id, note_id, content)
    return jsonify({'message': 'Note created successfully'}), 201

# --- GET a list of notes (with tag filtering) ---
@note_bp.route('', methods=['GET'])
def get_notes():
    user_id = request.args.get('user_id')
    tag = request.args.get('tag')
    if not user_id:
        return jsonify({'message': 'User ID is required'}), 401
    db = get_db()
    with db.cursor() as cursor:
        if tag:
            search_tag = f"%{tag}%"
            cursor.execute("SELECT * FROM notes WHERE user_id=%s AND tags LIKE %s ORDER BY created_at DESC", (user_id, search_tag))
        else:
            cursor.execute("SELECT * FROM notes WHERE user_id=%s ORDER BY created_at DESC", (user_id,))
        notes = cursor.fetchall()
        for note in notes:
            if note.get('created_at'):
                note['created_at'] = note['created_at'].isoformat()
    return jsonify(notes)

# --- UPDATE an existing note ---
@note_bp.route('/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    tags = data.get('tags', '')
    user_id = data.get('user_id')
    summary = ' '.join(content.split(' ')[:15]) + '...' if content else ''
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute(
            "UPDATE notes SET title=%s, content=%s, summary=%s, tags=%s WHERE id=%s",
            (title, content, summary, tags, note_id)
        )
    db.commit()
    if user_id:
        add_or_update_note(user_id, note_id, content)
    return jsonify({'message': 'Note updated successfully'})

# --- DELETE a note ---
@note_bp.route('/<int:note_id>', methods=['DELETE'])
def delete_note_route(note_id):
    user_id = request.args.get('user_id')
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute("DELETE FROM notes WHERE id=%s", (note_id,))
    db.commit()
    if user_id:
        delete_note(user_id, note_id)
    return jsonify({'message': 'Note deleted successfully'})

# --- SEARCH for notes ---
@note_bp.route('/search', methods=['GET'])
def search_notes():
    user_id = request.args.get('user_id')
    query = request.args.get('q')
    if not user_id: return jsonify({'message': 'User ID is required'}), 401
    if not query: return jsonify([])
    db = get_db()
    with db.cursor() as cursor:
        search_query = "%" + query + "%"
        cursor.execute("SELECT * FROM notes WHERE user_id=%s AND (title LIKE %s OR content LIKE %s) ORDER BY created_at DESC", (user_id, search_query, search_query))
        notes = cursor.fetchall()
        for note in notes:
            if note.get('created_at'):
                note['created_at'] = note['created_at'].isoformat()
    return jsonify(notes)

# --- GET all unique tags ---
@note_bp.route('/tags', methods=['GET'])
def get_all_tags():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'message': 'User ID is required'}), 401
    db = get_db()
    with db.cursor() as cursor:
        cursor.execute("SELECT tags FROM notes WHERE user_id=%s AND tags IS NOT NULL AND tags != ''", (user_id,))
        results = cursor.fetchall()
    all_tags = set()
    for row in results:
        tags = [tag.strip() for tag in row['tags'].split(',')]
        all_tags.update(tags)
    return jsonify(sorted(list(all_tags)))