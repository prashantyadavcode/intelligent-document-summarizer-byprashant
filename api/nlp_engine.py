from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
import torch
from typing import List, Dict, Any
import re

class NLPEngine:
    """
    Handles all NLP tasks including summarization, Q&A generation, and flashcard creation
    """
    
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self._initialize_models()
    
    def _initialize_models(self):
        """
        Initialize the required models for different tasks
        """
        try:
            # Summarization model
            self.summarizer = pipeline(
                "summarization",
                model="facebook/bart-large-cnn",
                device=0 if self.device == "cuda" else -1
            )
            
            # Q&A generation model
            self.qa_model_name = "google/flan-t5-large"
            self.qa_tokenizer = AutoTokenizer.from_pretrained(self.qa_model_name)
            self.qa_model = AutoModelForSeq2SeqLM.from_pretrained(self.qa_model_name)
            
            if self.device == "cuda":
                self.qa_model = self.qa_model.cuda()
                
        except Exception as e:
            print(f"Model initialization failed: {e}")
            # Fallback to smaller models for Vercel deployment
            self._initialize_fallback_models()
    
    def _initialize_fallback_models(self):
        """
        Initialize smaller, more efficient models for deployment
        """
        try:
            self.summarizer = pipeline(
                "summarization",
                model="facebook/bart-large-cnn",
                device=-1  # Force CPU
            )
            
            self.qa_model_name = "google/flan-t5-base"
            self.qa_tokenizer = AutoTokenizer.from_pretrained(self.qa_model_name)
            self.qa_model = AutoModelForSeq2SeqLM.from_pretrained(self.qa_model_name)
            
        except Exception as e:
            print(f"Fallback model initialization failed: {e}")
            raise RuntimeError("Unable to initialize NLP models")
    
    async def generate_summary(self, text: str) -> str:
        """
        Generate a concise summary of the input text
        """
        try:
            # Truncate text if too long for the model
            max_length = 1024
            if len(text) > max_length:
                text = text[:max_length]
            
            # Generate summary
            summary = self.summarizer(
                text,
                max_length=150,
                min_length=50,
                do_sample=False
            )
            
            return summary[0]['summary_text']
            
        except Exception as e:
            return f"Summary generation failed: {str(e)}"
    
    async def generate_qa_pairs(self, text: str) -> List[Dict[str, Any]]:
        """
        Generate Q&A pairs from the input text
        """
        try:
            # Split text into chunks for better Q&A generation
            chunks = self._split_text_into_chunks(text, chunk_size=500)
            qa_pairs = []
            
            for chunk in chunks[:3]:  # Limit to 3 chunks to avoid timeout
                chunk_qa = await self._generate_qa_for_chunk(chunk)
                qa_pairs.extend(chunk_qa)
            
            # Remove duplicates and limit to 10 pairs
            unique_qa = self._remove_duplicate_qa(qa_pairs)
            return unique_qa[:10]
            
        except Exception as e:
            return [{"question": "Error generating Q&A", "answer": str(e), "difficulty": "easy"}]
    
    async def _generate_qa_for_chunk(self, chunk: str) -> List[Dict[str, Any]]:
        """
        Generate Q&A pairs for a text chunk
        """
        try:
            prompt = f"""
            Based on the following text, generate 3 high-quality question-answer pairs that test understanding of key concepts.
            Focus on engineering and technical concepts. Format each as: Q: [question] A: [answer]
            
            Text: {chunk}
            """
            
            inputs = self.qa_tokenizer(prompt, return_tensors="pt", max_length=512, truncation=True)
            
            if self.device == "cuda":
                inputs = {k: v.cuda() for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = self.qa_model.generate(
                    **inputs,
                    max_length=200,
                    num_return_sequences=1,
                    temperature=0.7,
                    do_sample=True
                )
            
            response = self.qa_tokenizer.decode(outputs[0], skip_special_tokens=True)
            return self._parse_qa_response(response)
            
        except Exception as e:
            return []
    
    def _parse_qa_response(self, response: str) -> List[Dict[str, Any]]:
        """
        Parse the model response to extract Q&A pairs
        """
        qa_pairs = []
        lines = response.split('\n')
        
        current_qa = {}
        for line in lines:
            line = line.strip()
            if line.startswith('Q:'):
                if current_qa:
                    qa_pairs.append(current_qa)
                current_qa = {
                    'question': line[2:].strip(),
                    'answer': '',
                    'difficulty': 'medium'
                }
            elif line.startswith('A:') and current_qa:
                current_qa['answer'] = line[2:].strip()
        
        if current_qa and current_qa['answer']:
            qa_pairs.append(current_qa)
        
        return qa_pairs
    
    async def generate_flashcards(self, text: str) -> List[Dict[str, Any]]:
        """
        Generate flashcards from the input text
        """
        try:
            # Extract key terms and concepts
            key_terms = self._extract_key_terms(text)
            flashcards = []
            
            for term in key_terms[:15]:  # Limit to 15 flashcards
                flashcard = await self._create_flashcard_for_term(term, text)
                if flashcard:
                    flashcards.append(flashcard)
            
            return flashcards
            
        except Exception as e:
            return [{"front": "Error", "back": f"Flashcard generation failed: {str(e)}", "category": "error"}]
    
    def _extract_key_terms(self, text: str) -> List[str]:
        """
        Extract key terms and concepts from text
        """
        # Simple keyword extraction based on capitalization and technical terms
        words = text.split()
        key_terms = []
        
        for word in words:
            # Look for capitalized words, technical terms, or acronyms
            if (len(word) > 3 and 
                (word.isupper() or 
                 word[0].isupper() or 
                 any(char.isdigit() for char in word))):
                key_terms.append(word.strip('.,!?;:'))
        
        # Remove duplicates and return top terms
        unique_terms = list(set(key_terms))
        return unique_terms[:20]
    
    async def _create_flashcard_for_term(self, term: str, context: str) -> Dict[str, Any]:
        """
        Create a flashcard for a specific term
        """
        try:
            # Find context around the term
            term_context = self._find_term_context(term, context)
            
            prompt = f"""
            Create a flashcard for the term "{term}" based on this context: {term_context}
            Format as: Front: [term or question] Back: [definition or answer]
            """
            
            inputs = self.qa_tokenizer(prompt, return_tensors="pt", max_length=300, truncation=True)
            
            if self.device == "cuda":
                inputs = {k: v.cuda() for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = self.qa_model.generate(
                    **inputs,
                    max_length=100,
                    num_return_sequences=1,
                    temperature=0.5
                )
            
            response = self.qa_tokenizer.decode(outputs[0], skip_special_tokens=True)
            return self._parse_flashcard_response(response, term)
            
        except Exception as e:
            return None
    
    def _find_term_context(self, term: str, text: str) -> str:
        """
        Find context around a term in the text
        """
        sentences = text.split('.')
        for sentence in sentences:
            if term.lower() in sentence.lower():
                return sentence.strip()
        return text[:200]  # Fallback to first 200 characters
    
    def _parse_flashcard_response(self, response: str, term: str) -> Dict[str, Any]:
        """
        Parse flashcard response from model
        """
        lines = response.split('\n')
        front = term
        back = "Definition not available"
        
        for line in lines:
            line = line.strip()
            if line.startswith('Front:'):
                front = line[6:].strip()
            elif line.startswith('Back:'):
                back = line[5:].strip()
        
        return {
            'front': front,
            'back': back,
            'category': 'general',
            'difficulty': 'medium'
        }
    
    def _split_text_into_chunks(self, text: str, chunk_size: int = 500) -> List[str]:
        """
        Split text into overlapping chunks
        """
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - 100):  # 100 word overlap
            chunk = ' '.join(words[i:i + chunk_size])
            chunks.append(chunk)
        
        return chunks
    
    def _remove_duplicate_qa(self, qa_pairs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Remove duplicate Q&A pairs
        """
        seen_questions = set()
        unique_pairs = []
        
        for qa in qa_pairs:
            question_lower = qa['question'].lower()
            if question_lower not in seen_questions:
                seen_questions.add(question_lower)
                unique_pairs.append(qa)
        
        return unique_pairs
