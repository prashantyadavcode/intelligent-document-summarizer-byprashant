'use client'

import { useState, useRef } from 'react'
import { DocumentData } from '@/types/document'

export default function Home() {
  const [error, setError] = useState<string>('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [documentData, setDocumentData] = useState<DocumentData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, Word document, or text file.')
      return false
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.')
      return false
    }
    
    setError('')
    return true
  }

  const handleFileSelect = async (file: File) => {
    if (validateFile(file)) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        // Show processing state
        setError('Processing document... Please wait.')
        
        const response = await fetch('/api/process', {
          method: 'POST',
          body: formData,
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setError('')
        
        // Store results for display
        setDocumentData(data)
        
      } catch (error) {
        console.error('Error processing document:', error)
        setError(`Error processing document: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    
    const file = event.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Upload Your Document
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Upload research papers, articles, or any text document to get AI-generated summaries, 
          Q&A pairs, and flashcards for better understanding and learning.
        </p>
      </div>

      {!documentData && (
        <div className="max-w-2xl mx-auto">
          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-4 sm:p-6 lg:p-8 text-center cursor-pointer transition-colors
              ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
              ${error ? 'border-red-300 bg-red-50' : ''}
            `}
          >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          <div className="flex flex-col items-center space-y-3 sm:space-y-4">
            <div className="p-3 sm:p-4 bg-gray-100 rounded-full">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <div className="px-2">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                {isDragOver ? 'Drop the file here' : 'Upload your document'}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                Drag and drop a file here, or click to select
              </p>
            </div>
            
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 px-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-center">PDF, Word, or Text files up to 10MB</span>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mt-3 sm:mt-4 flex items-center space-x-2 text-red-600 px-4">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}
        </div>
      )}

      {/* Results Display */}
      {documentData && (
        <div className="max-w-4xl mx-auto mt-6 sm:mt-8 space-y-4 sm:space-y-6">
          <div className="text-center px-4">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Document Analysis Results</h3>
            <p className="text-sm sm:text-base text-gray-600">Generated summary, Q&A pairs, and flashcards for your document</p>
          </div>

          {/* Summary Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 mx-4 sm:mx-0">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">📄 Summary</h4>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{documentData.summary}</p>
          </div>

          {/* Q&A Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 mx-4 sm:mx-0">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">❓ Q&A Pairs ({documentData.qaPairs.length})</h4>
            <div className="space-y-3 sm:space-y-4">
              {documentData.qaPairs.map((qa, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-3 sm:pl-4">
                  <h5 className="text-sm sm:text-base font-medium text-gray-900 mb-1 sm:mb-2">Q{index + 1}: {qa.question}</h5>
                  <p className="text-sm sm:text-base text-gray-700 mb-2">A: {qa.answer}</p>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                    {qa.difficulty}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Flashcards Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 mx-4 sm:mx-0">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">🃏 Flashcards ({documentData.flashcards.length})</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {documentData.flashcards.map((card, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                  <div className="mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-500">Front:</span>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">{card.front}</p>
                  </div>
                  <div className="mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-500">Back:</span>
                    <p className="text-sm sm:text-base text-gray-700">{card.back}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{card.category}</span>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                      {card.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mx-4 sm:mx-0">
            <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2">Document Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <div className="break-words">
                <span className="font-medium">File:</span> {documentData.metadata.filename}
              </div>
              <div>
                <span className="font-medium">Words:</span> {documentData.metadata.wordCount}
              </div>
              <div>
                <span className="font-medium">Processing:</span> {documentData.metadata.processingTime}s
              </div>
              <div>
                <span className="font-medium">Type:</span> {documentData.metadata.documentType || 'general'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 px-4 sm:px-0">
            <button 
              onClick={() => setDocumentData(null)}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Process Another Document
            </button>
            <button 
              onClick={() => {
                const dataStr = JSON.stringify(documentData, null, 2)
                const dataBlob = new Blob([dataStr], {type: 'application/json'})
                const url = URL.createObjectURL(dataBlob)
                const link = document.createElement('a')
                link.href = url
                link.download = `${documentData.metadata.filename}_analysis.json`
                link.click()
              }}
              className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
            >
              Download Results
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
