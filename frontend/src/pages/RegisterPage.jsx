import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShield, FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', mobile: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await register({
        ...form,
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim(),
      })
      navigate('/app')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-primary px-6 py-12">
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
              <FiShield className="text-white text-2xl" />
            </div>
            <span className="text-3xl font-bold" style={{fontFamily: 'Playfair Display'}}>DigiLaw</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create account</h1>
          <p className="text-gray-600 dark:text-gray-400">Start your legal learning journey</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}
            
            {[
              {key: 'fullName', icon: FiUser, type: 'text', placeholder: 'Full Name'},
              {key: 'email', icon: FiMail, type: 'email', placeholder: 'Email'},
              {key: 'mobile', icon: FiPhone, type: 'tel', placeholder: 'Mobile Number'},
              {key: 'password', icon: FiLock, type: 'password', placeholder: 'Password'},
              {key: 'confirmPassword', icon: FiLock, type: 'password', placeholder: 'Confirm Password'},
            ].map(field => (
              <div key={field.key}>
                <div className="relative">
                  <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={field.type} required className="input pl-11" placeholder={field.placeholder}
                    value={form[field.key]} onChange={e => setForm({...form, [field.key]: e.target.value})} />
                </div>
              </div>
            ))}

            <button disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
            Already have an account? <Link to="/login" className="text-secondary font-medium hover:underline">Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
