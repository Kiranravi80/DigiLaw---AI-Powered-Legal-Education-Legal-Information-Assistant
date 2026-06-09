import { useTheme } from '../context/ThemeContext'
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi'

export default function SettingsPage() {
  const { theme, fontSize, updateTheme, updateFontSize } = useTheme()

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6" style={{fontFamily: 'Playfair Display'}}>Settings</h1>
        
        <div className="space-y-6">
          <div className="card">
            <h2 className="font-semibold mb-4">Appearance</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {id: 'light', label: 'Light', icon: FiSun},
                    {id: 'dark', label: 'Dark', icon: FiMoon},
                    {id: 'system', label: 'System', icon: FiMonitor},
                  ].map(t => (
                    <button key={t.id} onClick={() => updateTheme(t.id)}
                      className={`p-4 rounded-xl border-2 transition flex flex-col items-center gap-2 ${
                        theme === t.id ? 'border-secondary bg-secondary/5' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                      }`}>
                      <t.icon className="text-xl" />
                      <span className="text-sm font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-3">Font Size</label>
                <div className="grid grid-cols-3 gap-3">
                  {['small', 'medium', 'large'].map(size => (
                    <button key={size} onClick={() => updateFontSize(size)}
                      className={`p-3 rounded-xl border-2 capitalize transition ${
                        fontSize === size ? 'border-secondary bg-secondary/5' : 'border-gray-200 dark:border-slate-700'
                      }`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold mb-2">About DigiLaw</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Version 1.0.0 • AI-Powered Legal Education</p>
            <p className="text-xs text-gray-500 mt-2">Educational purposes only. Not legal advice.</p>
          </div>
        </div>
      </div>
    </div>
  )
}