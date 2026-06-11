import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import ChatView from '../components/ChatView'
import ProfilePage from './ProfilePage'
import SettingsPage from './SettingsPage'
import BookmarksPage from './BookmarksPage'
import { api } from '../services/api'

export default function MainApp() {
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadChats()
  }, [])

  const loadChats = async () => {
    try {
      const res = await api.get('/api/chats/')
      setChats(res.data)
    } catch (e) {
      console.error(e)
    }
  }

  const createNewChat = async () => {
    try {
      const res = await api.post('/api/chats/', { title: 'New Chat' })
      const newChat = res.data
      setChats([newChat, ...chats])
      setActiveChat(newChat.id)
      navigate(`/app/chat/${newChat.id}`)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="h-screen flex bg-background dark:bg-primary overflow-hidden">
      <Sidebar 
        chats={chats}
        activeChat={activeChat}
        onNewChat={createNewChat}
        onSelectChat={(id) => { setActiveChat(id); navigate(`/app/chat/${id}`) }}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onChatsUpdate={loadChats}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Routes>
          <Route path="/" element={<ChatView chatId={activeChat} onNewChat={createNewChat} sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />} />
          <Route path="/chat/:id" element={<ChatView onNewChat={createNewChat} sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  )
}
