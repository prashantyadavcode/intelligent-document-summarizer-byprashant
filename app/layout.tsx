import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Intelligent Document Summarizer',
  description: 'AI-powered document summarization, Q&A generation, and flashcard creation',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-center py-3 sm:py-4 space-y-2 sm:space-y-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 text-center sm:text-left">
                  Intelligent Document Summarizer
                </h1>
                <div className="text-sm sm:text-base text-gray-600">
                  Created by Prashant
                </div>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
