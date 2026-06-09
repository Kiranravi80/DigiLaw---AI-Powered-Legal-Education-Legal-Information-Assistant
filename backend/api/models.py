from mongoengine import Document, StringField, EmailField, DateTimeField, BooleanField, ListField, ReferenceField, DictField, IntField
from datetime import datetime
import bcrypt

class User(Document):
    meta = {'collection': 'users'}
    full_name = StringField(required=True, max_length=100)
    email = EmailField(required=True, unique=True)
    mobile = StringField(required=True, max_length=15)
    password_hash = StringField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    is_active = BooleanField(default=True)
    
    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    @property
    def id(self):
        return str(self.pk)
    
    @property
    def is_authenticated(self):
        return True

class DisclaimerAcceptance(Document):
    meta = {'collection': 'disclaimer_acceptances'}
    user = ReferenceField(User, required=True)
    accepted = BooleanField(default=False)
    accepted_at = DateTimeField(default=datetime.utcnow)
    ip_address = StringField()

class Chat(Document):
    meta = {'collection': 'chats'}
    user = ReferenceField(User, required=True)
    title = StringField(required=True, default="New Chat")
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    is_active = BooleanField(default=True)

class Message(Document):
    meta = {'collection': 'messages'}
    chat = ReferenceField(Chat, required=True)
    user = ReferenceField(User, required=True)
    role = StringField(required=True, choices=['user', 'assistant'])
    content = StringField(required=True)
    structured_data = DictField()  # For AI response structure
    created_at = DateTimeField(default=datetime.utcnow)

class Bookmark(Document):
    meta = {'collection': 'bookmarks'}
    user = ReferenceField(User, required=True)
    title = StringField(required=True)
    content = StringField(required=True)
    category = StringField(choices=['law', 'response', 'concept'])
    source_chat = ReferenceField(Chat)
    created_at = DateTimeField(default=datetime.utcnow)

class UserSettings(Document):
    meta = {'collection': 'user_settings'}
    user = ReferenceField(User, required=True, unique=True)
    theme = StringField(default='system', choices=['light', 'dark', 'system'])
    font_size = StringField(default='medium', choices=['small', 'medium', 'large'])
    updated_at = DateTimeField(default=datetime.utcnow)