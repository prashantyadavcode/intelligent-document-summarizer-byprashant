'use client'

import { Loader2, FileText, Brain, HelpCircle, CreditCard } from 'lucide-react'

interface ProcessingStatusProps {
  step: string
}

export default function ProcessingStatus({ step }: ProcessingStatusProps) {
  const steps = [
    { icon: FileText, label: 'Extracting text', completed: step.includes('Uploading') || step.includes('Processing') },
    { icon: Brain, label: 'Generating summary', completed: step.includes('Processing') },
    { icon: HelpCircle, label: 'Creating Q&A pairs', completed: step.includes('Processing') },
    { icon: CreditCard, label: 'Building flashcards', completed: step.includes('Processing') }
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
            <h3 className="text-lg font-medium text-gray-900">Processing Document</h3>
          </div>
          <p className="text-gray-600">{step}</p>
        </div>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`
                p-2 rounded-full transition-colors
                ${step.completed ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}
              `}>
                <step.icon className="w-4 h-4" />
              </div>
              <span className={`
                text-sm transition-colors
                ${step.completed ? 'text-gray-900' : 'text-gray-500'}
              `}>
                {step.label}
              </span>
              {step.completed && (
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
