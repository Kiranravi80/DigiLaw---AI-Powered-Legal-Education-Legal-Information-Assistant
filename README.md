# DigiLaw – AI-Powered Legal Education & Legal Information Assistant

> Making Indian legal knowledge accessible, understandable, and available to everyone.

DigiLaw is an AI-powered legal education platform designed to help citizens understand Indian laws, legal rights, duties, procedures, and legal concepts through conversational AI. The platform combines Large Language Models (LLMs) with Retrieval-Augmented Generation (RAG) to deliver context-aware legal information sourced from official legal documents and legislation.

**Disclaimer:** DigiLaw provides legal information and educational content only. It does not provide legal advice, legal representation, or establish an attorney-client relationship.

---

## Problem Statement

Legal information is often difficult for ordinary citizens to understand due to complex legal terminology, lengthy legislation, and limited access to legal resources.

DigiLaw addresses this challenge by providing:

* Simplified explanations of legal concepts
* AI-powered legal information retrieval
* Structured legal guidance
* Rights and responsibilities awareness
* Multilingual-friendly legal education

---

## Key Features

### AI Legal Information Assistant

* Conversational legal information retrieval
* Context-aware responses using RAG architecture
* Powered by Llama 3 via Groq API

### Legal Knowledge Base

* Constitution of India
* Bharatiya Nyaya Sanhita (BNS)
* Bharatiya Nagarik Suraksha Sanhita (BNSS)
* Bharatiya Sakshya Adhiniyam (BSA)
* Information Technology Act
* Consumer Protection Laws
* Additional legal datasets

### Structured Responses

Every response is organized into:

* Quick Summary
* Legal Overview
* Rights
* Duties
* Procedures
* Penalties
* Real-Life Examples
* Related Laws
* Recent Amendments

### User Experience

* Responsive design
* Dark & Light themes
* Chat history management
* Bookmarks and saved responses
* Smart legal action suggestions

### Security & Authentication

* JWT Authentication
* Secure password hashing
* Protected API endpoints
* User preference management

---

## System Architecture

User Query
↓
ChromaDB Vector Search
↓
Relevant Legal Context Retrieval
↓
Groq Llama 3 Processing
↓
Structured Legal Response
↓
MongoDB Storage

The platform uses Retrieval-Augmented Generation (RAG) to reduce hallucinations and improve legal information accuracy by grounding AI responses in legal source materials.

---

## Technology Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Framer Motion
* React Router
* Axios

### Backend

* Django
* Django REST Framework
* MongoEngine

### Database

* MongoDB
* ChromaDB (Vector Database)

### Artificial Intelligence

* Groq API
* Llama 3 70B
* Retrieval-Augmented Generation (RAG)

### Authentication

* JWT (JSON Web Tokens)

---

## Project Structure

```text
digilaw/
├── backend/
│   ├── digilaw_backend/
│   ├── api/
│   ├── legal_data/
│   ├── chroma_db/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   └── services/
│
├── docker-compose.yml
└── README.md
```

---

## Installation

### Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

python manage.py runserver
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## Environment Configuration

### Backend (.env)

```env
SECRET_KEY=your_secret_key
DEBUG=False
MONGODB_URI=your_mongodb_uri
GROQ_API_KEY=your_groq_api_key
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000
```

---

## API Modules

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

MIT License

---

## Important Disclaimer

DigiLaw is an educational and informational platform. The information generated by the system should not be considered legal advice. Users should consult qualified legal professionals for case-specific legal guidance. DigiLaw, its developers, and contributors are not responsible for decisions made based on information generated by the platform.
