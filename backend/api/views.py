from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import jwt
from datetime import datetime, timedelta
from .models import User, Chat, Message, Bookmark, DisclaimerAcceptance, UserSettings
from .services.rag_service import RAGService

# Helper to generate JWT
def generate_tokens(user):
    payload = {
        'user_id': str(user.id),
        'email': user.email,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    access = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return {'access': access}

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    data = request.data
    try:
        if User.objects(email=data['email']).first():
            return Response({'error': 'Email already exists'}, status=400)
        
        if data['password'] != data['confirmPassword']:
            return Response({'error': 'Passwords do not match'}, status=400)
        
        user = User(
            full_name=data['fullName'],
            email=data['email'],
            mobile=data['mobile']
        )
        user.set_password(data['password'])
        user.save()
        
        # Create default settings
        UserSettings(user=user).save()
        
        tokens = generate_tokens(user)
        return Response({
            'message': 'Registration successful',
            'tokens': tokens,
            'user': {'id': str(user.id), 'full_name': user.full_name, 'email': user.email}
        })
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    data = request.data
    try:
        user = User.objects(email=data['email']).first()
        if not user or not user.check_password(data['password']):
            return Response({'error': 'Invalid credentials'}, status=401)
        
        tokens = generate_tokens(user)
        
        # Check disclaimer
        disclaimer = DisclaimerAcceptance.objects(user=user, accepted=True).first()
        
        return Response({
            'tokens': tokens,
            'user': {'id': str(user.id), 'full_name': user.full_name, 'email': user.email},
            'disclaimer_accepted': bool(disclaimer)
        })
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
def accept_disclaimer(request):
    try:
        user = request.user
        DisclaimerAcceptance.objects(user=user).delete()
        disclaimer = DisclaimerAcceptance(
            user=user,
            accepted=True,
            ip_address=request.META.get('REMOTE_ADDR', '')
        )
        disclaimer.save()
        return Response({'message': 'Disclaimer accepted'})
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
def check_disclaimer(request):
    user = request.user
    accepted = DisclaimerAcceptance.objects(user=user, accepted=True).first()
    return Response({'accepted': bool(accepted)})

@api_view(['GET', 'POST'])
def chats(request):
    user = request.user
    if request.method == 'GET':
        chats = Chat.objects(user=user, is_active=True).order_by('-updated_at')
        data = [{'id': str(c.id), 'title': c.title, 'updated_at': c.updated_at.isoformat()} for c in chats]
        return Response(data)
    
    # POST - create new chat
    chat = Chat(user=user, title=request.data.get('title', 'New Chat'))
    chat.save()
    return Response({'id': str(chat.id), 'title': chat.title})

@api_view(['GET', 'PUT', 'DELETE'])
def chat_detail(request, chat_id):
    user = request.user
    try:
        chat = Chat.objects(id=chat_id, user=user).first()
        if not chat:
            return Response({'error': 'Not found'}, status=404)
        
        if request.method == 'GET':
            messages = Message.objects(chat=chat).order_by('created_at')
            msgs = [{
                'id': str(m.id),
                'role': m.role,
                'content': m.content,
                'structured_data': m.structured_data,
                'created_at': m.created_at.isoformat()
            } for m in messages]
            return Response({'chat': {'id': str(chat.id), 'title': chat.title}, 'messages': msgs})
        
        elif request.method == 'PUT':
            chat.title = request.data.get('title', chat.title)
            chat.updated_at = datetime.utcnow()
            chat.save()
            return Response({'message': 'Updated'})
        
        else:  # DELETE
            chat.is_active = False
            chat.save()
            return Response({'message': 'Deleted'})
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
def send_message(request, chat_id):
    user = request.user
    try:
        chat = Chat.objects(id=chat_id, user=user).first()
        if not chat:
            return Response({'error': 'Chat not found'}, status=404)
        
        question = request.data.get('message', '')
        
        # Save user message
        user_msg = Message(chat=chat, user=user, role='user', content=question)
        user_msg.save()
        
        # Get AI response via RAG
        rag = RAGService()
        structured = rag.get_legal_answer(question)
        
        # Save AI message
        ai_msg = Message(
            chat=chat,
            user=user,
            role='assistant',
            content=structured.get('quick_summary', ''),
            structured_data=structured
        )
        ai_msg.save()
        
        # Update chat title if first message
        if Message.objects(chat=chat).count() <= 2:
            chat.title = question[:50] + ('...' if len(question) > 50 else '')
        
        chat.updated_at = datetime.utcnow()
        chat.save()
        
        return Response({
            'message': {
                'id': str(ai_msg.id),
                'role': 'assistant',
                'content': ai_msg.content,
                'structured_data': structured,
                'created_at': ai_msg.created_at.isoformat()
            }
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def action_button(request):
    try:
        action = request.data.get('action')
        question = request.data.get('question')
        original_data = request.data.get('data', {})
        
        rag = RAGService()
        response = rag.handle_action(action, question, original_data)
        
        return Response({'response': response})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET', 'POST'])
def bookmarks(request):
    user = request.user
    if request.method == 'GET':
        bookmarks = Bookmark.objects(user=user).order_by('-created_at')
        data = [{
            'id': str(b.id),
            'title': b.title,
            'content': b.content,
            'category': b.category,
            'created_at': b.created_at.isoformat()
        } for b in bookmarks]
        return Response(data)
    
    # POST
    try:
        bookmark = Bookmark(
            user=user,
            title=request.data['title'],
            content=request.data['content'],
            category=request.data.get('category', 'response')
        )
        bookmark.save()
        return Response({'message': 'Bookmarked', 'id': str(bookmark.id)})
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['DELETE'])
def delete_bookmark(request, bookmark_id):
    user = request.user
    bookmark = Bookmark.objects(id=bookmark_id, user=user).first()
    if bookmark:
        bookmark.delete()
    return Response({'message': 'Deleted'})

@api_view(['GET', 'PUT'])
def profile(request):
    user = request.user
    if request.method == 'GET':
        return Response({
            'full_name': user.full_name,
            'email': user.email,
            'mobile': user.mobile,
            'created_at': user.created_at.isoformat()
        })
    
    # PUT
    data = request.data
    user.full_name = data.get('full_name', user.full_name)
    user.mobile = data.get('mobile', user.mobile)
    if data.get('password'):
        user.set_password(data['password'])
    user.save()
    return Response({'message': 'Profile updated'})

@api_view(['GET', 'PUT'])
def settings_view(request):
    user = request.user
    user_settings = UserSettings.objects(user=user).first()
    if not user_settings:
        user_settings = UserSettings(user=user)
        user_settings.save()
    
    if request.method == 'GET':
        return Response({
            'theme': user_settings.theme,
            'font_size': user_settings.font_size
        })
    
    data = request.data
    user_settings.theme = data.get('theme', user_settings.theme)
    user_settings.font_size = data.get('font_size', user_settings.font_size)
    user_settings.updated_at = datetime.utcnow()
    user_settings.save()
    return Response({'message': 'Settings updated'})