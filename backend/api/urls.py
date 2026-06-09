from django.urls import path
from . import views

urlpatterns = [
    path('auth/register/', views.register),
    path('auth/login/', views.login),
    path('disclaimer/accept/', views.accept_disclaimer),
    path('disclaimer/check/', views.check_disclaimer),
    path('chats/', views.chats),
    path('chats/<str:chat_id>/', views.chat_detail),
    path('chats/<str:chat_id>/message/', views.send_message),
    path('action/', views.action_button),
    path('bookmarks/', views.bookmarks),
    path('bookmarks/<str:bookmark_id>/', views.delete_bookmark),
    path('profile/', views.profile),
    path('settings/', views.settings_view),
]