export interface QAPair {
  question: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic?: string
}

export interface Flashcard {
  front: string
  back: string
  category?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

export interface DocumentData {
  summary: string
  qaPairs: QAPair[]
  flashcards: Flashcard[]
  metadata: {
    filename: string
    wordCount: number
    processingTime: number
    timestamp: string
  }
}

export interface ProcessingStatus {
  step: string
  progress: number
  isComplete: boolean
  error?: string
}
