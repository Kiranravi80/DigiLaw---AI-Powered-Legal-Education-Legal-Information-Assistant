import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiMic, FiMenu, FiShield } from 'react-icons/fi'
import { api } from '../services/api'
import MessageBubble from './MessageBubble'

const SUGGESTED = [
  "What is Cybercrime?",
  "Explain Consumer Rights.",
  "What is an FIR?",
  "Explain Labour Laws.",
  "Explain Constitutional Rights."
]

export default function ChatView({ onNewChat, sidebarOpen, onToggleSidebar }) {
  const { id } = useParams()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [chat, setChat] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (id) loadChat()
    else { setMessages([]); setChat(null) }
  }, [id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadChat = async () => {
    try {
      const res = await api.get(`/api/chats/${id}/`)
      setChat(res.data.chat)
      setMessages(res.data.messages)
    } catch (e) {
      console.error(e)
    }
  }

  const sendMessage = async (text = input) => {
    if (!text.trim() || loading) return
    
    const userMsg = { role: 'user', content: text, created_at: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      let chatId = id
      if (!chatId) {
        const newChat = await api.post('/api/chats/', { title: text.slice(0, 50) })
        chatId = newChat.data.id
        window.history.replaceState(null, '', `/app/chat/${chatId}`)
      }

      const res = await api.post(`/api/chats/${chatId}/message/`, { message: text })
      setMessages(prev => [...prev, res.data.message])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, error occurred. Please try again.', created_at: new Date().toISOString() }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-14 border-b border-gray-200 dark:border-slate-800 flex items-center px-4 gap-3 shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
        <button onClick={onToggleSidebar} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg lg:hidden">
          <FiMenu />
        </button>
        {!sidebarOpen && (
          <button onClick={onToggleSidebar} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg hidden lg:block">
            <FiMenu />
          </button>
        )}
        <h2 className="font-semibold truncate">{chat?.title || 'New Chat'}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center max-w-2xl w-full">
              <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-secondary mb-6 shadow-xl">
                  <FiShield className="text-4xl text-white" />
                </div>
                <h1 className="text-4xl font-bold mb-3" style={{fontFamily: 'Playfair Display'}}>Welcome to DigiLaw</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">Ask any legal question to start learning.</p>
              </motion.div>
              
              <div className="grid sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                {SUGGESTED.map((q, i) => (
                  <motion.button key={q} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: i*0.05}}
                    onClick={() => sendMessage(q)}
                    className="p-4 text-left card hover:border-secondary hover:shadow-md transition text-sm">
                    {q}
                  </motion.button>
                ))}
              </div>
              <p className="mt-8 text-xs text-gray-500">Educational only • Not legal advice</p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <FiShield className="text-white text-sm" />
                </div>
                <div className="card py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2 bg-gray-50 dark:bg-slate-800 rounded-2xl p-2 border border-gray-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent">
            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Ask about any law, right, or procedure..."
              className="flex-1 bg-transparent px-3 py-2.5 outline-none resize-none max-h-32 min-h-[44px]"
              rows={1} />
            <button className="p-2.5 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl transition" title="Voice (coming soon)">
              <FiMic className="text-gray-500" />
            </button>
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
              className="p-2.5 bg-secondary hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition">
              <FiSend />
            </button>
          </div>
          <p className="text-[11px] text-center text-gray-500 mt-2">DigiLaw provides educational information only. Consult a lawyer for legal advice.</p>
        </div>
      </div>
    </div>
  )
}
