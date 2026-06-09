import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShield, FiPlus, FiMessageSquare, FiBookmark, FiUser, FiSettings, FiLogOut, FiX, FiTrash2, FiEdit2 } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Sidebar({ chats, activeChat, onNewChat, onSelectChat, isOpen, onToggle, onChatsUpdate }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!confirm('Delete this chat?')) return
    try {
      await axios.delete(`${API_URL}/api/chats/${id}/`)
      onChatsUpdate()
      if (activeChat === id) navigate('/app')
    } catch {}
  }

  const handleRename = async (id) => {
    try {
      await axios.put(`${API_URL}/api/chats/${id}/`, { title: editTitle })
      setEditingId(null)
      onChatsUpdate()
    } catch {}
  }

  const menuItems = [
    { icon: FiBookmark, label: 'Saved Topics', path: '/app/bookmarks' },
    { icon: FiUser, label: 'Profile', path: '/app/profile' },
    { icon: FiSettings, label: 'Settings', path: '/app/settings' },
  ]

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={onToggle} />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: 'spring', damping: 30 }}
        className="fixed lg:relative z-50 w-80 h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
          <Link to="/app" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
              <FiShield className="text-white" />
            </div>
            <span className="text-xl font-bold" style={{fontFamily: 'Playfair Display'}}>DigiLaw</span>
          </Link>
          <button onClick={onToggle} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
            <FiX />
          </button>
        </div>

        {/* New Chat */}
        <div className="p-3">
          <button onClick={onNewChat} className="w-full btn-primary flex items-center justify-center gap-2">
            <FiPlus /> New Chat
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Recent Chats</p>
          <div className="space-y-1">
            {chats.map(chat => (
              <div key={chat.id} onClick={() => onSelectChat(chat.id)}
                className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition ${
                  activeChat === chat.id || location.pathname.includes(chat.id)
                    ? 'bg-secondary/10 text-secondary' 
                    : 'hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}>
                <FiMessageSquare className="shrink-0" />
                {editingId === chat.id ? (
                  <input autoFocus value={editTitle} onChange={e => setEditTitle(e.target.value)}
                    onBlur={() => handleRename(chat.id)} onKeyDown={e => e.key === 'Enter' && handleRename(chat.id)}
                    className="flex-1 bg-transparent outline-none text-sm" onClick={e => e.stopPropagation()} />
                ) : (
                  <span className="flex-1 truncate text-sm">{chat.title}</span>
                )}
                <div className="hidden group-hover:flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); setEditingId(chat.id); setEditTitle(chat.title) }}
                    className="p-1 hover:bg-black/10 rounded"><FiEdit2 size={14} /></button>
                  <button onClick={(e) => handleDelete(chat.id, e)} className="p-1 hover:bg-red-500/20 text-red-600 rounded"><FiTrash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="p-3 border-t border-gray-200 dark:border-slate-800 space-y-1">
          {menuItems.map(item => (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                location.pathname === item.path ? 'bg-gray-100 dark:bg-slate-800' : 'hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}>
              <item.icon /> <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
          
          <div className="pt-3 mt-3 border-t border-gray-200 dark:border-slate-800">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-accent">{user?.full_name?.[0]}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{user?.full_name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              <button onClick={logout} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg" title="Logout">
                <FiLogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}