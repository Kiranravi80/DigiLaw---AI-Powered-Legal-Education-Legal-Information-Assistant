import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
from urllib.parse import urlparse

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / '.env')

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-digilaw-dev-key-change-in-production')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '*').split(',')

INSTALLED_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'rest_framework',
    'corsheaders',
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'digilaw_backend.urls'

TEMPLATES = []

WSGI_APPLICATION = 'digilaw_backend.wsgi.application'

# MongoDB Connection via mongoengine
import mongoengine
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/digilaw')
MONGODB_DB_NAME = os.getenv('MONGODB_DB_NAME', 'digilaw')

mongo_options = {'host': MONGODB_URI}
if not urlparse(MONGODB_URI).path.strip('/'):
    mongo_options['db'] = MONGODB_DB_NAME

mongoengine.connect(**mongo_options)

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'api.authentication.MongoJWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=7),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
}

# CORS
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Groq
GROQ_API_KEY = os.getenv('GROQ_API_KEY', '')

# ChromaDB
CHROMA_PERSIST_DIR = os.path.join(BASE_DIR, 'chroma_db')

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
