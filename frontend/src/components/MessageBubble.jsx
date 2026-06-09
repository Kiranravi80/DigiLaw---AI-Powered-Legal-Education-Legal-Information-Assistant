import { motion } from 'framer-motion'
import { FiShield, FiUser, FiBookmark, FiCopy, FiChevronDown } from 'react-icons/fi'
import { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const data = message.structured_data
  const [actionLoading, setActionLoading] = useState('')
  const [actionResult, setActionResult] = useState('')
  const [expanded, setExpanded] = useState({})

  const handleAction = async (action) => {
    setActionLoading(action)
    try {
      const res = await axios.post(`${API_URL}/api/action/`, {
        action,
        question: message.content,
        data: data
      })
      setActionResult(res.data.response)
    } catch (e) {
      setActionResult('Error processing request')
    } finally {
      setActionLoading('')
    }
  }

  const bookmark = async () => {
    try {
      await axios.post(`${API_URL}/api/bookmarks/`, {
        title: message.content.slice(0, 100),
        content: JSON.stringify(data || message.content),
        category: 'response'
      })
      alert('Bookmarked!')
    } catch {}
  }

  const copyText = () => {
    navigator.clipboard.writeText(message.content)
  }

  if (isUser) {
    return (
      <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="flex gap-3 justify-end">
        <div className="max-w-[80%] bg-secondary text-white px-5 py-3 rounded-2xl rounded-br-md">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
          <FiUser className="text-sm" />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1">
        <FiShield className="text-white text-sm" />
      </div>
      <div className="flex-1 min-w-0 space-y-3">
        {/* Structured Response */}
        {data ? (
          <div className="space-y-3">
            {/* Quick Summary */}
            <div className="card border-l-4 border-secondary">
              <h3 className="font-semibold text-secondary mb-2 flex items-center gap-2">Quick Summary</h3>
              <p className="text-gray-700 dark:text-gray-300">{data.quick_summary}</p>
            </div>

            {/* Main sections */}
            <div className="grid md:grid-cols-2 gap-3">
              {[
                {key: 'law_overview', title: 'Law Overview', content: data.law_overview},
                {key: 'why_exists', title: 'Why This Law Exists', content: data.why_exists},
              ].map(section => (
                <div key={section.key} className="card">
                  <button onClick={() => setExpanded({...expanded, [section.key]: !expanded[section.key]})}
                    className="w-full flex items-center justify-between font-semibold mb-2">
                    {section.title}
                    <FiChevronDown className={`transition ${expanded[section.key] ? 'rotate-180' : ''}`} />
                  </button>
                  {expanded[section.key] !== false && (
                    <p className="text-sm text-gray-700 dark:text-gray-300">{section.content}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Lists */}
            {[
              {key: 'rights', title: 'Your Rights', items: data.rights, color: 'green'},
              {key: 'duties', title: 'Your Duties', items: data.duties, color: 'blue'},
              {key: 'procedure', title: 'Procedure', items: data.procedure, color: 'purple'},
              {key: 'penalties', title: 'Penalties', items: data.penalties, color: 'red'},
            ].map(section => section.items?.length > 0 && (
              <div key={section.key} className="card">
                <h4 className="font-semibold mb-3">{section.title}</h4>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-${section.color}-500 shrink-0`}></span>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Example */}
            {data.real_life_example && (
              <div className="card bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold mb-2 text-amber-900 dark:text-amber-100">Real-Life Example</h4>
                <p className="text-sm text-amber-800 dark:text-amber-200">{data.real_life_example}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                {id: 'explain_more', label: 'Explain More'},
                {id: 'show_example', label: 'Show Example'},
                {id: 'show_rights', label: 'Show Rights'},
                {id: 'show_procedure', label: 'Show Procedure'},
                {id: 'show_penalties', label: 'Show Penalties'},
                {id: 'simplify', label: 'Simplify'},
              ].map(btn => (
                <button key={btn.id} onClick={() => handleAction(btn.id)}
                  disabled={actionLoading}
                  className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition disabled:opacity-50">
                  {actionLoading === btn.id ? '...' : btn.label}
                </button>
              ))}
              <button onClick={bookmark} className="px-3 py-1.5 text-xs font-medium bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition flex items-center gap-1">
                <FiBookmark size={12} /> Save
              </button>
              <button onClick={copyText} className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-gray-200 transition flex items-center gap-1">
                <FiCopy size={12} /> Copy
              </button>
            </div>

            {actionResult && (
              <div className="card bg-blue-50 dark:bg-blue-900/10 border-blue-200">
                <p className="text-sm whitespace-pre-wrap">{actionResult}</p>
              </div>
            )}

            <p className="text-[11px] text-gray-500 italic">⚖️ Educational information only. Not legal advice. Verify with official sources.</p>
          </div>
        ) : (
          <div className="card">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}