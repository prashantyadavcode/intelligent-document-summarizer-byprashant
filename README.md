# Intelligent Document Summarizer

An AI-powered web application that automatically summarizes documents, generates Q&A pairs, and creates flashcards for enhanced learning and understanding.

## Features

- **Document Summarization**: Extract key points and main ideas from long documents
- **Q&A Generation**: Create relevant questions and answers to test understanding
- **Flashcard Creation**: Generate flashcards for efficient memorization and review
- **Multiple Formats**: Support for PDF, Word documents, and plain text files
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS

## Tech Stack

### Frontend
- **Next.js 14** with React and TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Dropzone** for file uploads

### Backend
- **Python FastAPI** for API endpoints
- **Hugging Face Transformers** for NLP tasks
- **PyTorch** for model inference
- **Vercel Serverless Functions** for deployment

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── about/             # About page
├── components/            # React components
│   ├── FileUpload.tsx    # File upload component
│   ├── ProcessingStatus.tsx # Processing status display
│   ├── ResultsDisplay.tsx   # Results display
│   ├── SummaryView.tsx      # Summary view
│   ├── QAView.tsx          # Q&A view
│   └── FlashcardView.tsx   # Flashcard view
├── types/                 # TypeScript type definitions
│   └── document.ts       # Document-related types
├── api/                  # Python API endpoints
│   ├── process.py       # Main processing endpoint
│   ├── document_processor.py # Text extraction
│   ├── nlp_engine.py    # NLP processing
│   └── health.py        # Health check endpoint
├── package.json         # Node.js dependencies
├── requirements.txt     # Python dependencies
├── vercel.json         # Vercel configuration
└── README.md          # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd intelligent-document-summarizer
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Deployment on Vercel

1. **Connect your repository to Vercel**
   - Import your GitHub repository in Vercel dashboard
   - Vercel will automatically detect the Next.js configuration

2. **Configure environment variables** (if needed)
   - Add any required environment variables in Vercel dashboard

3. **Deploy**
   - Vercel will automatically build and deploy your application
   - Both frontend and Python API functions will be deployed

## API Endpoints

- `POST /api/process` - Process uploaded documents
- `GET /api/health` - Health check endpoint
- `GET /api/status` - Detailed status check

## Usage

1. **Upload a Document**: Drag and drop or select a PDF, Word document, or text file
2. **Wait for Processing**: The AI will analyze your document and generate content
3. **Explore Results**: View the summary, Q&A pairs, and flashcards
4. **Study Mode**: Use the flashcards for active learning

## Model Information

The application uses the following pre-trained models:

- **Summarization**: `facebook/bart-large-cnn`
- **Q&A Generation**: `google/flan-t5-large`
- **Text Processing**: Custom prompts and techniques

## Limitations

- File size limit: 10MB
- Processing time: Up to 60 seconds (Vercel Pro plan)
- Model memory constraints in serverless environment
- Cold start latency for first requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open a GitHub issue or contact the maintainers.
