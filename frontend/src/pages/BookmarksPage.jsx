import { useState, useEffect } from 'react'
import axios from 'axios'
import { FiBookmark, FiTrash2 } from 'react-icons/fi'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([])

  useEffect(() => {
    loadBookmarks()
  }, [])

  const loadBookmarks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/bookmarks/`)
      setBookmarks(res.data)
    } catch {}
  }

  const deleteBookmark = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/bookmarks/${id}/`)
      loadBookmarks()
    } catch {}
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3" style={{fontFamily: 'Playfair Display'}}>
          <FiBookmark className="text-accent" /> Saved Topics
        </h1>
        
        {bookmarks.length === 0 ? (
          <div className="card text-center py-12">
            <FiBookmark className="mx-auto text-4xl text-gray-300 mb-3" />
            <p className="text-gray-600">No bookmarks yet. Save important legal information from chats.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookmarks.map(b => (
              <div key={b.id} className="card group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-2">{b.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{b.content.slice(0, 200)}...</p>
                    <p className="text-xs text-gray-500 mt-3">{new Date(b.created_at).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => deleteBookmark(b.id)} 
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 text-red-600 rounded-lg transition">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}