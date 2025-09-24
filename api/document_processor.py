import io
import PyPDF2
import docx
from typing import Optional

class DocumentProcessor:
    """
    Handles text extraction from various document formats
    """
    
    async def extract_text(self, file) -> str:
        """
        Extract text from uploaded file based on its content type
        """
        content = await file.read()
        
        if file.content_type == 'application/pdf':
            return self._extract_from_pdf(content)
        elif file.content_type in ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']:
            return self._extract_from_docx(content)
        elif file.content_type == 'text/plain':
            return content.decode('utf-8')
        else:
            raise ValueError(f"Unsupported file type: {file.content_type}")
    
    def _extract_from_pdf(self, content: bytes) -> str:
        """
        Extract text from PDF content
        """
        try:
            pdf_file = io.BytesIO(content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            
            return text.strip()
        except Exception as e:
            raise ValueError(f"Failed to extract text from PDF: {str(e)}")
    
    def _extract_from_docx(self, content: bytes) -> str:
        """
        Extract text from Word document content
        """
        try:
            doc_file = io.BytesIO(content)
            doc = docx.Document(doc_file)
            
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            
            return text.strip()
        except Exception as e:
            raise ValueError(f"Failed to extract text from Word document: {str(e)}")
    
    def clean_text(self, text: str) -> str:
        """
        Clean and preprocess extracted text
        """
        # Remove excessive whitespace
        text = ' '.join(text.split())
        
        # Remove special characters but keep punctuation
        import re
        text = re.sub(r'[^\w\s.,!?;:()\-]', '', text)
        
        return text.strip()
