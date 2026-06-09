from groq import Groq
from django.conf import settings
import json

class GroqService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = "llama3-70b-8192"
    
    def generate_legal_response(self, user_question, context=""):
        """Generate structured legal education response"""
        
        system_prompt = """You are DigiLaw, an AI-Powered Legal Education Assistant for Indian law. You are NOT a lawyer and do NOT provide legal advice.

Your role is EDUCATIONAL ONLY. Teach laws, rights, duties, and procedures.

CRITICAL RULES:
1. Always start by teaching the LAW, not the user's situation
2. Never say "you should" - instead say "the law states" or "generally"
3. Always include disclaimer: "This is educational information only, not legal advice"
4. Structure every response in JSON format with these exact keys:
{
  "quick_summary": "2-3 sentences",
  "law_overview": "detailed explanation",
  "why_exists": "purpose of law",
  "important_concepts": ["concept1", "concept2"],
  "rights": ["right1", "right2"],
  "duties": ["duty1", "duty2"],
  "procedure": ["step1", "step2"],
  "penalties": ["penalty1"],
  "real_life_example": "example",
  "recent_amendments": "amendments or 'None'",
  "related_laws": ["law1", "law2"]
}

5. Be clear, simple, and educational
6. Focus on Indian laws: Constitution, BNS, BNSS, BSA, IT Act, Consumer Protection, etc.
"""
        
        user_prompt = f"""Context from legal database:
{context}

User Question: {user_question}

Provide educational response in JSON format only. No markdown, no extra text, just valid JSON."""
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,
                max_tokens=2000,
            )
            
            content = response.choices[0].message.content.strip()
            # Clean JSON if wrapped in markdown
            if content.startswith('```'):
                content = content.split('```')[1]
                if content.startswith('json'):
                    content = content[4:]
                content = content.strip()
            
            structured = json.loads(content)
            return structured
        except Exception as e:
            # Fallback structure
            return {
                "quick_summary": "Unable to generate detailed response. Please try again.",
                "law_overview": f"Error: {str(e)}",
                "why_exists": "Legal education is important for awareness.",
                "important_concepts": [],
                "rights": [],
                "duties": [],
                "procedure": [],
                "penalties": [],
                "real_life_example": "",
                "recent_amendments": "None",
                "related_laws": []
            }
    
    def generate_action_response(self, action, original_data, user_question):
        """Generate specific action responses"""
        prompts = {
            'explain_more': f"Explain in more detail: {user_question}. Original: {json.dumps(original_data)}",
            'show_example': f"Provide 3 detailed real-life examples for: {user_question}",
            'show_rights': f"List all rights in detail for: {user_question}",
            'show_procedure': f"Explain step-by-step legal procedure for: {user_question}",
            'show_penalties': f"Detail all penalties and punishments for: {user_question}",
            'show_amendments': f"List recent amendments for laws related to: {user_question}",
            'simplify': f"Explain like I'm 15 years old: {user_question}",
            'translate': f"Translate to simple Hindi: {user_question}"
        }
        
        prompt = prompts.get(action, user_question)
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are DigiLaw educational assistant. Provide clear, simple educational information about Indian law. Not legal advice."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4,
                max_tokens=1000,
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Unable to process request: {str(e)}"