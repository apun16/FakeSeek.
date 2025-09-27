'use client'

import { useProgress } from '@/lib/progress-context'
import Link from 'next/link'

export default function ProgressIndicator() {
  const { digitalSafetyScore, getScoreLevel, getScoreColor, getScoreMessage } = useProgress()

  return (
    <div className="fixed top-20 right-4 z-50 bg-white dark:bg-navy rounded-lg shadow-lg border border-gray-200 dark:border-white/20 p-4 min-w-[280px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Digital Safety Level</h3>
        <Link 
          href="/learn"
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
        >
          Learn More
        </Link>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{getScoreLevel()}</span>
          <span className="text-xs font-medium text-gray-900 dark:text-white">{digitalSafetyScore}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`bg-gradient-to-r ${getScoreColor()} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${digitalSafetyScore}%` }}
          ></div>
        </div>
      </div>
      
      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
        {getScoreMessage()}
      </p>
    </div>
  )
}
