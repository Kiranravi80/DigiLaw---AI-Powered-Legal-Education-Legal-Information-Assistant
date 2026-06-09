import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiShield, FiBookOpen, FiUsers, FiZap, FiCheck, FiArrowRight } from 'react-icons/fi'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-primary">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-primary/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <FiShield className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold" style={{fontFamily: 'Playfair Display'}}>DigiLaw</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="font-medium hover:text-secondary transition">Login</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.6}}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <FiZap /> AI-Powered Legal Education
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6" style={{fontFamily: 'Playfair Display'}}>
              Understand the Law.<br/>
              <span className="text-secondary">Know Your Rights.</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
              AI-Powered Legal Education & Legal Information Assistant. Learn laws, rights, duties, and procedures in simple language.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                Get Started <FiArrowRight />
              </Link>
              <a href="#features" className="px-8 py-4 rounded-xl font-medium border-2 border-gray-200 dark:border-slate-700 hover:border-secondary transition">
                Learn More
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-500">Educational purposes only • Not legal advice • No attorney-client relationship</p>
          </motion.div>
          
          <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{duration:0.6, delay:0.2}} className="relative">
            <div className="card p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">You asked:</p>
                  <p className="font-medium">What is Cybercrime under IT Act?</p>
                </div>
                <div className="bg-secondary/5 p-4 rounded-xl border-l-4 border-secondary">
                  <p className="text-sm font-semibold text-secondary mb-2">Quick Summary</p>
                  <p className="text-sm">Cybercrime includes hacking, identity theft, phishing, and publishing obscene content online. Punishable under IT Act 2000.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['Rights', 'Procedure', 'Penalties', 'Examples'].map(item => (
                    <div key={item} className="bg-white dark:bg-slate-800 p-3 rounded-lg border text-center text-sm font-medium">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -z-10 inset-0 bg-gradient-to-r from-secondary to-accent blur-3xl opacity-20"></div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white dark:bg-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{fontFamily: 'Playfair Display'}}>Everything you need to learn law</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Powered by AI, built for everyone</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {icon: FiBookOpen, title: 'Learn Laws Simply', desc: 'Complex legal concepts explained in plain English with structured breakdowns'},
              {icon: FiShield, title: 'Know Your Rights', desc: 'Understand your constitutional rights, consumer rights, and legal protections'},
              {icon: FiUsers, title: 'AI Assistant 24/7', desc: 'Ask any legal question and get instant educational responses'},
            ].map((f, i) => (
              <motion.div key={i} whileHover={{y:-5}} className="card">
                <f.icon className="text-3xl text-secondary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16" style={{fontFamily: 'Playfair Display'}}>How DigiLaw Works</h2>
          <div className="space-y-12">
            {[
              {step: '01', title: 'Ask Your Question', desc: 'Type any legal question in simple language'},
              {step: '02', title: 'AI Searches Law Database', desc: 'Our RAG system finds relevant laws from Constitution, BNS, IT Act, etc.'},
              {step: '03', title: 'Get Structured Answer', desc: 'Receive clear breakdown: summary, rights, duties, procedure, penalties'},
            ].map((s) => (
              <div key={s.step} className="flex gap-8 items-start">
                <div className="text-6xl font-bold text-accent/20" style={{fontFamily: 'Playfair Display'}}>{s.step}</div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">{s.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white dark:bg-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12" style={{fontFamily: 'Playfair Display'}}>Legal Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Constitution', 'BNS (IPC)', 'BNSS (CrPC)', 'BSA (Evidence)', 'IT Act', 'Consumer Protection', 'Labour Laws', 'Motor Vehicles'].map(cat => (
              <div key={cat} className="card text-center hover:border-secondary transition cursor-pointer">
                <p className="font-medium">{cat}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12" style={{fontFamily: 'Playfair Display'}}>FAQ</h2>
          <div className="space-y-4">
            {[
              {q: 'Is DigiLaw a law firm?', a: 'No. DigiLaw is an educational platform only. We do not provide legal advice or create attorney-client relationships.'},
              {q: 'Is the information accurate?', a: 'We use AI with legal databases, but laws change. Always verify with official sources or consult a lawyer for actual cases.'},
              {q: 'Is it free?', a: 'Yes, DigiLaw V1 is completely free for legal education.'},
            ].map((faq, i) => (
              <div key={i} className="card">
                <h3 className="font-semibold mb-2 flex items-start gap-2"><FiCheck className="text-green-600 mt-1 shrink-0" /> {faq.q}</h3>
                <p className="text-gray-600 dark:text-gray-400 ml-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <FiShield className="text-white" />
            </div>
            <span className="text-xl font-bold text-text dark:text-white" style={{fontFamily: 'Playfair Display'}}>DigiLaw</span>
          </div>
          <p>© 2024 DigiLaw. Educational purposes only. Not legal advice.</p>
        </div>
      </footer>
    </div>
  )
}