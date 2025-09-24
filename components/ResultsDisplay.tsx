'use client'

import { useState } from 'react'
import { DocumentData } from '@/types/document'
import SummaryView from './SummaryView'
import QAView from './QAView'
import FlashcardView from './FlashcardView'
import { FileText, HelpCircle, CreditCard } from 'lucide-react'

interface ResultsDisplayProps {
  data: DocumentData
}

type ViewType = 'summary' | 'qa' | 'flashcards'

export default function ResultsDisplay({ data }: ResultsDisplayProps) {
  const [activeView, setActiveView] = useState<ViewType>('summary')

  const tabs = [
    { id: 'summary' as ViewType, label: 'Summary', icon: FileText },
    { id: 'qa' as ViewType, label: 'Q&A Pairs', icon: HelpCircle },
    { id: 'flashcards' as ViewType, label: 'Flashcards', icon: CreditCard }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Analysis Complete</h2>
        <p className="text-gray-600">Explore the generated content below</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`
                flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeView === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-96">
        {activeView === 'summary' && <SummaryView summary={data.summary} />}
        {activeView === 'qa' && <QAView qaPairs={data.qaPairs} />}
        {activeView === 'flashcards' && <FlashcardView flashcards={data.flashcards} />}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button className="btn-primary">
          Download Results
        </button>
        <button className="btn-secondary">
          Process Another Document
        </button>
      </div>
    </div>
  )
}
