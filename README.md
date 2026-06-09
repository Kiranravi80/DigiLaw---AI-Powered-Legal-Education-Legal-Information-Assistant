# DigiLaw V1 - AI Powered Legal Education & Legal Information Assistant

Understand the Law. Know Your Rights.

DigiLaw is a production-ready, full-stack web application that helps ordinary people understand Indian laws, rights, duties, and procedures through AI-powered educational assistance.

**⚠️ IMPORTANT: Educational purposes only. NOT legal advice. Does NOT create attorney-client relationship.**

## Features

- 🤖 AI-powered legal education using Groq Llama 3
- 📚 RAG architecture with ChromaDB vector search
- 💬 Structured responses: Summary, Rights, Duties, Procedure, Penalties
- 🔖 Bookmark system
- 🌗 Dark/Light mode
- 📱 Fully responsive
- 🔐 JWT Authentication
- 💾 MongoDB storage
- 🎨 Premium UI with Framer Motion

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, React Router, Axios
**Backend:** Django 4.2, Django REST Framework, MongoEngine
**Database:** MongoDB
**AI:** Groq API (Llama 3 70B), ChromaDB
**Auth:** JWT

## Project Structure

```
digilaw/
├── backend/
│   ├── digilaw_backend/    # Django settings
│   ├── api/                # REST API
│   │   ├── models.py       # MongoDB models
│   │   ├── views.py        # API endpoints
│   │   └── services/       # Groq & Chroma services
│   └── legal_data/         # JSON legal knowledge base
├── frontend/
│   └── src/
│       ├── pages/          # Landing, Login, Chat, etc.
│       ├── components/     # Sidebar, ChatView, MessageBubble
│       └── context/        # Auth & Theme
└── docker-compose.yml
```

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB
- Groq API Key (free at console.groq.com)

### 1. Backend Setup

```bash
cd backend
python -m venv venv
Windows: venv\Scripts\activate       #source venv/bin/activate   
pip install -r requirements.txt

cp .env.example .env
# Edit .env and add your GROQ_API_KEY

python manage.py runserver 0.0.0.0:8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173

### 3. Docker (Alternative)

```bash
# Create .env in root
echo "GROQ_API_KEY=your_key_here" > .env
echo "SECRET_KEY=your-secret" >> .env

docker-compose up --build
```

Frontend: http://localhost:5173
Backend: http://localhost:8000

## Environment Variables

**Backend (.env)**
```
SECRET_KEY=your-django-secret
DEBUG=True
MONGODB_URI=mongodb://localhost:27017/digilaw
GROQ_API_KEY=gsk_... (from groq.com)
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:8000
```

## API Documentation

### Authentication
- `POST /api/auth/register/` - Register
- `POST /api/auth/login/` - Login
- `POST /api/disclaimer/accept/` - Accept disclaimer

### Chats
- `GET /api/chats/` - List chats
- `POST /api/chats/` - Create chat
- `GET /api/chats/:id/` - Get chat with messages
- `POST /api/chats/:id/message/` - Send message (AI response)
- `PUT /api/chats/:id/` - Rename
- `DELETE /api/chats/:id/` - Delete

### Other
- `POST /api/action/` - Smart action buttons
- `GET/POST /api/bookmarks/` - Bookmarks
- `GET/PUT /api/profile/` - Profile
- `GET/PUT /api/settings/` - Settings

## MongoDB Collections

- **users** - User accounts (bcrypt hashed passwords)
- **chats** - Chat sessions
- **messages** - User and AI messages with structured_data
- **bookmarks** - Saved laws/responses
- **disclaimer_acceptances** - Legal disclaimer tracking
- **user_settings** - Theme and preferences

## RAG Architecture

1. User asks question
2. ChromaDB searches legal_data JSON files (Constitution, BNS, IT Act, etc.)
3. Top 5 relevant chunks retrieved
4. Context + question sent to Groq Llama 3
5. Structured JSON response generated
6. Response saved to MongoDB

## Legal Knowledge Base

Add more laws in `backend/legal_data/` as JSON:

```json
{
  "Section 66": "Computer related offences...",
  "Section 67": "Publishing obscene material..."
}
```

ChromaDB auto-indexes on first run.

## AI Response Structure

Every response includes:
1. Quick Summary
2. Law Overview
3. Why This Law Exists
4. Important Concepts
5. Rights
6. Duties
7. Procedure
8. Penalties
9. Real-Life Example
10. Recent Amendments
11. Related Laws

## Smart Actions

After each response:
- Explain More
- Show Example
- Show Rights
- Show Procedure
- Show Penalties
- Simplify
- Translate

## Security

- JWT tokens (7-day expiry)
- Bcrypt password hashing
- CORS protection
- Input validation
- Protected routes
- Disclaimer mandatory

## Deployment

### Production Checklist
1. Set `DEBUG=False`
2. Change `SECRET_KEY`
3. Use MongoDB Atlas
4. Set `ALLOWED_HOSTS`
5. Enable HTTPS
6. Add rate limiting
7. Use environment secrets

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Development Notes

- No admin dashboard (by design)
- No role management (users only)
- All chats stored in MongoDB
- ChromaDB persists in `./backend/chroma_db`
- First AI query initializes vector DB (~30 seconds)

## Limitations

- Educational only, not legal advice
- AI can make mistakes
- Indian laws focus (can extend)
- Groq free tier: rate limits apply

## License

MIT - Educational use only

## Disclaimer

DigiLaw is not a law firm. Information provided is for educational purposes only and does not constitute legal advice. Always consult a qualified lawyer for legal matters. No attorney-client relationship is created by using this platform.

---

Built with ❤️ for legal literacy in India