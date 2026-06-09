import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function ProfilePage() {
  const [profile, setProfile] = useState({ full_name: '', email: '', mobile: '' })
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/profile/`)
      setProfile(res.data)
    } catch {}
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.put(`${API_URL}/api/profile/`, { ...profile, password: password || undefined })
      setMessage('Profile updated successfully')
      setPassword('')
    } catch {
      setMessage('Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6" style={{fontFamily: 'Playfair Display'}}>Profile</h1>
        
        <div className="card">
          <form onSubmit={saveProfile} className="space-y-5">
            {message && <div className="p-3 rounded-xl bg-green-50 text-green-700 text-sm">{message}</div>}
            
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input className="input" value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input className="input bg-gray-50" value={profile.email} disabled />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Mobile</label>
              <input className="input" value={profile.mobile} onChange={e => setProfile({...profile, mobile: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">New Password (leave blank to keep current)</label>
              <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            
            <button disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}