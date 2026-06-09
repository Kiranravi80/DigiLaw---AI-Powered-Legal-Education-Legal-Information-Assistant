from .chroma_service import ChromaService
from .groq_service import GroqService

class RAGService:
    def __init__(self):
        self.chroma = ChromaService()
        self.groq = GroqService()
        # Initialize on first use
        try:
            self.chroma.initialize_knowledge_base()
        except:
            pass
    
    def get_legal_answer(self, question):
        """RAG pipeline: search -> retrieve -> generate"""
        # 1. Search ChromaDB
        context = self.chroma.search(question, n_results=5)
        
        # 2. Generate with Groq
        structured_response = self.groq.generate_legal_response(question, context)
        
        return structured_response
    
    def handle_action(self, action, question, original_data):
        return self.groq.generate_action_response(action, original_data, question)