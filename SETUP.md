# DigiLaw V1 - Complete Setup Guide

## ✅ What's Built

Complete production-ready application with:

**Backend (Django):**
- JWT authentication with MongoDB
- 6 MongoDB collections
- Groq Llama 3 integration
- ChromaDB RAG pipeline
- 12 API endpoints
- Legal knowledge base (6 laws)

**Frontend (React):**
- Landing page with 6 sections
- Login/Register with validation
- Mandatory disclaimer flow
- Main app with sidebar
- Real-time chat with AI
- Structured responses (11 sections)
- 8 smart action buttons
- Bookmarks, Profile, Settings
- Dark mode, responsive, animations

## 🚀 Run Locally (3 steps)

### Step 1: Get Groq API Key
1. Go to https://console.groq.com
2. Sign up (free)
3. Create API key
4. Copy key (starts with gsk_)

### Step 2: Start Backend
```bash
cd digilaw/backend
pip install -r requirements.txt

# Create .env
echo "GROQ_API_KEY=gsk_your_key_here" > .env
echo "MONGODB_URI=mongodb://localhost:27017/digilaw" >> .env
echo "SECRET_KEY=dev-secret-123" >> .env

# Start MongoDB (in another terminal)
mongod

# Run Django
python manage.py runserver
```
Backend runs at http://localhost:8000

### Step 3: Start Frontend
```bash
cd digilaw/frontend
npm install
npm run dev
```
Frontend runs at http://localhost:5173

## 🎯 First Use

1. Open http://localhost:5173
2. Click "Get Started"
3. Register account
4. Accept disclaimer
5. Ask: "What is Cybercrime?"
6. Get structured AI response

## 📁 Key Files

**You can customize:**
- `backend/legal_data/*.json` - Add more laws
- `frontend/src/pages/LandingPage.jsx` - Edit landing
- `frontend/tailwind.config.js` - Change colors
- `backend/api/services/groq_service.py` - Modify AI prompts

## 🎨 Design System

Colors (from spec):
- Primary: #0F172A (slate-900)
- Secondary: #1E3A8A (blue-900)
- Accent: #D4AF37 (gold)
- Background: #F8FAFC

## 🔧 Testing API

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@test.com","mobile":"9999999999","password":"test123","confirmPassword":"test123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

## 🐳 Docker

```bash
cd digilaw
echo "GROQ_API_KEY=gsk_..." > .env
docker-compose up --build
```

## ⚡ Features Demo

Try these questions:
- "What is an FIR?"
- "Explain Consumer Rights"
- "What is Article 21?"
- "Explain BNS 103"
- "What are labour laws for overtime?"

Each gives:
✓ Quick summary
✓ Law overview
✓ Rights & duties
✓ Procedure
✓ Penalties
✓ Real example
✓ Action buttons

## 🛠️ Troubleshooting

**MongoDB not connecting:**
- Install MongoDB: https://mongodb.com/try/download/community
- Or use Atlas: replace MONGODB_URI

**Groq API error:**
- Check API key in .env
- Free tier: 30 requests/minute

**ChromaDB slow first time:**
- Normal: indexing legal data (~30s)
- Subsequent queries instant

**Frontend can't reach backend:**
- Check VITE_API_URL in frontend
- Ensure backend on port 8000

## 📊 Architecture

```
User Question
    ↓
React Frontend
    ↓
Django API (/api/chats/:id/message/)
    ↓
RAG Service
    ├─→ ChromaDB (search legal_data)
    └─→ Groq Llama 3 (generate)
    ↓
Structured JSON Response
    ↓
MongoDB (save)
    ↓
React (display cards)
```

## 🎓 Production Deployment

1. **Backend:** Railway, Render, or AWS
   - Set env vars
   - Use MongoDB Atlas
   - gunicorn already configured

2. **Frontend:** Vercel, Netlify
   - Build command: `npm run build`
   - Output: `dist`
   - Set VITE_API_URL

3. **Database:** MongoDB Atlas (free tier)

## 📝 Next Steps (V2)

- Voice input/output
- Multi-language (Hindi)
- PDF upload for case analysis
- Lawyer directory
- Legal document templates
- Mobile app

---

**Built as specified:** No admin dashboard, no lawyer dashboard, no role management. Pure user-focused legal education.