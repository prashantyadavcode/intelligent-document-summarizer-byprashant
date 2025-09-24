'use client'

import { useState } from 'react'
import { Flashcard } from '@/types/document'
import { ChevronLeft, ChevronRight, RotateCcw, Eye, EyeOff } from 'lucide-react'

interface FlashcardViewProps {
  flashcards: Flashcard[]
}

export default function FlashcardView({ flashcards }: FlashcardViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [studyMode, setStudyMode] = useState(false)

  const currentCard = flashcards[currentIndex]

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowAnswer(false)
    }
  }

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowAnswer(false)
    }
  }

  const resetCards = () => {
    setCurrentIndex(0)
    setShowAnswer(false)
    setStudyMode(false)
  }

  if (flashcards.length === 0) {
    return (
      <div className="card text-center">
        <p className="text-gray-600">No flashcards generated for this document.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Flashcards ({flashcards.length})
        </h3>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Card {currentIndex + 1} of {flashcards.length}
          </div>
          <button
            onClick={resetCards}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Flashcard Display */}
      <div className="max-w-2xl mx-auto">
        <div className="card min-h-64 flex flex-col justify-center">
          <div className="text-center space-y-4">
            <div className="text-sm text-gray-500 uppercase tracking-wide">
              {showAnswer ? 'Answer' : 'Question'}
            </div>
            
            <div className="text-lg text-gray-900 leading-relaxed">
              {showAnswer ? currentCard.back : currentCard.front}
            </div>

            {currentCard.category && (
              <div className="text-sm text-gray-500">
                Category: {currentCard.category}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={prevCard}
            disabled={currentIndex === 0}
            className={`
              flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors
              ${currentIndex === 0 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }
            `}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="flex items-center space-x-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showAnswer ? 'Hide Answer' : 'Show Answer'}</span>
          </button>

          <button
            onClick={nextCard}
            disabled={currentIndex === flashcards.length - 1}
            className={`
              flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors
              ${currentIndex === flashcards.length - 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }
            `}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
