export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About</h1>
      
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What is Intelligent Document Summarizer?</h2>
          <p className="text-gray-600 leading-relaxed">
            The Intelligent Document Summarizer is an AI-powered web application designed to help students, 
            researchers, and professionals quickly understand complex documents. Using advanced natural language 
            processing techniques, it automatically generates summaries, creates relevant Q&A pairs, and 
            produces flashcards for effective learning.
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span><strong>Document Summarization:</strong> Extract key points and main ideas from long documents</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span><strong>Q&A Generation:</strong> Create relevant questions and answers to test understanding</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span><strong>Flashcard Creation:</strong> Generate flashcards for efficient memorization and review</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span><strong>Multiple Formats:</strong> Support for PDF, Word documents, and plain text</span>
            </li>
          </ul>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Technology Stack</h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Frontend</h3>
              <ul className="space-y-1">
                <li>• Next.js 14 with React</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• Lucide React Icons</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Backend</h3>
              <ul className="space-y-1">
                <li>• Python FastAPI</li>
                <li>• Hugging Face Transformers</li>
                <li>• PyTorch</li>
                <li>• Vercel Serverless Functions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
