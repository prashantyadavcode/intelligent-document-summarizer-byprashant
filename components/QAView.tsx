'use client'

import { useState } from 'react'
import { QAPair } from '@/types/document'
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react'

interface QAViewProps {
  qaPairs: QAPair[]
}

export default function QAView({ qaPairs }: QAViewProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())
  const [showAnswers, setShowAnswers] = useState<Set<number>>(new Set())

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  const toggleAnswer = (index: number) => {
    const newShowAnswers = new Set(showAnswers)
    if (newShowAnswers.has(index)) {
      newShowAnswers.delete(index)
    } else {
      newShowAnswers.add(index)
    }
    setShowAnswers(newShowAnswers)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Q&A Pairs ({qaPairs.length})
        </h3>
        <div className="text-sm text-gray-600">
          Click on questions to expand and reveal answers
        </div>
      </div>

      <div className="space-y-3">
        {qaPairs.map((qa, index) => (
          <div key={index} className="card">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Q{index + 1}: {qa.question}
                  </h4>
                  <div className="text-sm text-gray-600">
                    Difficulty: <span className="font-medium">{qa.difficulty}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleExpanded(index)}
                  className="ml-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {expandedItems.has(index) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {expandedItems.has(index) && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleAnswer(index)}
                      className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      {showAnswers.has(index) ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span>Hide Answer</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>Show Answer</span>
                        </>
                      )}
                    </button>
                  </div>

                  {showAnswers.has(index) && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">
                        <strong>Answer:</strong> {qa.answer}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
