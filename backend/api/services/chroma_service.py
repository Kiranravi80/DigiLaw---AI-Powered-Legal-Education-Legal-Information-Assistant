import chromadb
from chromadb.config import Settings
from django.conf import settings
import os
import json

class ChromaService:
    def __init__(self):
        self.client = chromadb.PersistentClient(
            path=settings.CHROMA_PERSIST_DIR,
            settings=Settings(anonymized_telemetry=False)
        )
        self.collection = self.client.get_or_create_collection(
            name="legal_knowledge",
            metadata={"hnsw:space": "cosine"}
        )
    
    def initialize_knowledge_base(self):
        """Load legal data from JSON files"""
        legal_data_path = os.path.join(settings.BASE_DIR, 'legal_data')
        
        if not os.path.exists(legal_data_path):
            return
        
        # Check if already populated
        if self.collection.count() > 0:
            return
        
        documents = []
        metadatas = []
        ids = []
        
        for filename in os.listdir(legal_data_path):
            if filename.endswith('.json'):
                filepath = os.path.join(legal_data_path, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        law_name = filename.replace('.json', '')
                        
                        # Handle different JSON structures
                        if isinstance(data, list):
                            for i, item in enumerate(data):
                                content = json.dumps(item) if isinstance(item, dict) else str(item)
                                documents.append(content)
                                metadatas.append({"law": law_name, "type": "provision"})
                                ids.append(f"{law_name}_{i}")
                        elif isinstance(data, dict):
                            for key, value in data.items():
                                content = f"{key}: {json.dumps(value) if isinstance(value, dict) else value}"
                                documents.append(content)
                                metadatas.append({"law": law_name, "section": key})
                                ids.append(f"{law_name}_{key}")
                except Exception as e:
                    print(f"Error loading {filename}: {e}")
        
        if documents:
            # Add in batches
            batch_size = 100
            for i in range(0, len(documents), batch_size):
                self.collection.add(
                    documents=documents[i:i+batch_size],
                    metadatas=metadatas[i:i+batch_size],
                    ids=ids[i:i+batch_size]
                )
    
    def search(self, query, n_results=5):
        """Search legal knowledge base"""
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=n_results
            )
            
            if results['documents'] and results['documents'][0]:
                context = "\n\n".join(results['documents'][0])
                return context
            return ""
        except Exception as e:
            print(f"Chroma search error: {e}")
            return ""
