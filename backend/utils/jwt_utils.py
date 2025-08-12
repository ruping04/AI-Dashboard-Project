import jwt
import datetime
from config import Config

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }
    return jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')

def verify_token(token):
    try:
        decoded = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
        return decoded['user_id']
    except jwt.ExpiredSignatureError:
        return None
