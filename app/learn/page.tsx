'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useProgress } from '@/lib/progress-context'

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: 'ai-basics' | 'deepfake-detection' | 'digital-safety' | 'cybersecurity'
}

interface QuizResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
  categoryScores: Record<string, { correct: number; total: number }>
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is a deepfake?",
    options: [
      "A type of computer virus",
      "AI-generated synthetic media that replaces a person's likeness",
      "A social media filter",
      "A video editing software"
    ],
    correctAnswer: 1,
    explanation: "A deepfake is AI-generated synthetic media that uses deep learning to replace a person's likeness with someone else's, often creating convincing but fake videos or images.",
    category: 'ai-basics'
  },
  {
    id: 2,
    question: "Which of these is NOT a common sign of a deepfake video?",
    options: [
      "Inconsistent lighting on the face",
      "Unnatural eye movements or blinking",
      "High video quality",
      "Audio that doesn't match lip movements"
    ],
    correctAnswer: 2,
    explanation: "High video quality is not a sign of a deepfake. Common signs include inconsistent lighting, unnatural eye movements, and audio-visual mismatches.",
    category: 'deepfake-detection'
  },
  {
    id: 3,
    question: "What should you do if you receive a suspicious video claiming to be from a family member?",
    options: [
      "Share it immediately on social media",
      "Call the person directly to verify",
      "Ignore it completely",
      "Forward it to all your contacts"
    ],
    correctAnswer: 1,
    explanation: "Always verify suspicious content by calling the person directly through a known phone number or meeting them in person. Never share unverified content.",
    category: 'digital-safety'
  },
  {
    id: 4,
    question: "Which technology is commonly used to create deepfakes?",
    options: [
      "Blockchain",
      "Generative Adversarial Networks (GANs)",
      "Quantum computing",
      "Cloud storage"
    ],
    correctAnswer: 1,
    explanation: "Generative Adversarial Networks (GANs) are the primary technology used to create deepfakes, where two neural networks compete to create increasingly realistic synthetic content.",
    category: 'ai-basics'
  },
  {
    id: 5,
    question: "What is the best way to protect yourself from deepfake scams?",
    options: [
      "Never use video calls",
      "Be skeptical of unexpected video content and verify through other channels",
      "Only trust videos from verified accounts",
      "Use only the latest smartphones"
    ],
    correctAnswer: 1,
    explanation: "The best protection is to be skeptical of unexpected video content and always verify through other communication channels, especially for financial or personal requests.",
    category: 'digital-safety'
  },
  {
    id: 6,
    question: "Which of these is a red flag for a deepfake image?",
    options: [
      "Perfect symmetry in facial features",
      "Slight blur around the edges of the face",
      "Natural skin texture",
      "Consistent lighting throughout the image"
    ],
    correctAnswer: 1,
    explanation: "Blur around the edges of the face is a common red flag for deepfakes, as the AI often struggles to perfectly blend the face with the background.",
    category: 'deepfake-detection'
  },
  {
    id: 7,
    question: "What is 'phishing' in the context of digital security?",
    options: [
      "A type of fishing game",
      "A method of catching fish using technology",
      "A cyber attack that tricks people into revealing sensitive information",
      "A way to store passwords securely"
    ],
    correctAnswer: 2,
    explanation: "Phishing is a cyber attack method where attackers trick people into revealing sensitive information like passwords or credit card numbers through fake emails, websites, or messages.",
    category: 'cybersecurity'
  },
  {
    id: 8,
    question: "How can you verify if a video call is legitimate?",
    options: [
      "Ask the person to move their hand in front of their face",
      "Check if the video quality is high",
      "Verify the caller's identity through a separate channel",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "All of these methods help verify a video call. Asking for specific movements, checking video quality, and verifying identity through separate channels are all good practices.",
    category: 'digital-safety'
  },
  {
    id: 9,
    question: "What does 'AI' stand for?",
    options: [
      "Automated Intelligence",
      "Artificial Intelligence",
      "Advanced Internet",
      "Automated Internet"
    ],
    correctAnswer: 1,
    explanation: "AI stands for Artificial Intelligence, which refers to computer systems that can perform tasks that typically require human intelligence.",
    category: 'ai-basics'
  },
  {
    id: 10,
    question: "Which of these is the most secure way to share sensitive information?",
    options: [
      "Through social media DMs",
      "Via email",
      "Through encrypted messaging apps",
      "By posting it publicly"
    ],
    correctAnswer: 2,
    explanation: "Encrypted messaging apps provide the highest level of security for sharing sensitive information, as the messages are encrypted and harder to intercept.",
    category: 'cybersecurity'
  }
]

export default function LearnPage() {
  const { digitalSafetyScore, updateScore, getScoreLevel, getScoreColor, getScoreMessage } = useProgress()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null))
  const [quizProgress, setQuizProgress] = useState(0)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)

  // Calculate quiz progress based on correct answers
  useEffect(() => {
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === quizQuestions[index].correctAnswer
    ).length
    const newProgress = Math.round((correctAnswers / quizQuestions.length) * 100)
    setQuizProgress(newProgress)
  }, [userAnswers])

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuestion] = selectedAnswer
    setUserAnswers(newUserAnswers)
    
    // Update digital safety score based on answer
    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correctAnswer
    if (isCorrect) {
      updateScore(2) // +2 points for correct answer
    } else {
      updateScore(-1) // -1 point for wrong answer
    }
    
    // Also update digitalPassportProgress for the prevention progress bar
    const currentProgress = localStorage.getItem('digitalPassportProgress') || '0'
    const currentScore = parseInt(currentProgress)
    const progressChange = isCorrect ? 2 : -1 // Same as digital safety score
    const newProgress = Math.max(0, Math.min(100, currentScore + progressChange))
    localStorage.setItem('digitalPassportProgress', newProgress.toString())
    localStorage.setItem('lastActivity', 'ai_safety_quiz')
    
    setShowResult(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(userAnswers[currentQuestion + 1])
      setShowResult(false)
    } else {
      // Quiz completed
      calculateQuizResult()
      setQuizCompleted(true)
    }
  }

  const calculateQuizResult = () => {
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === quizQuestions[index].correctAnswer
    ).length
    const wrongAnswers = quizQuestions.length - correctAnswers
    
    const categoryScores: Record<string, { correct: number; total: number }> = {}
    quizQuestions.forEach((question, index) => {
      const category = question.category
      if (!categoryScores[category]) {
        categoryScores[category] = { correct: 0, total: 0 }
      }
      categoryScores[category].total++
      if (userAnswers[index] === question.correctAnswer) {
        categoryScores[category].correct++
      }
    })

    // Give bonus points for completing the quiz
    const quizScore = Math.round((correctAnswers / quizQuestions.length) * 100)
    const currentProgress = localStorage.getItem('digitalPassportProgress') || '0'
    const currentScore = parseInt(currentProgress)
    let bonusPoints = 0
    
    if (quizScore >= 80) {
      bonusPoints = 5 // Bonus for excellent performance
    } else if (quizScore >= 60) {
      bonusPoints = 3 // Bonus for good performance
    } else {
      bonusPoints = 1 // Small bonus for completion
    }
    
    const newProgress = Math.max(0, Math.min(100, currentScore + bonusPoints))
    localStorage.setItem('digitalPassportProgress', newProgress.toString())

    setQuizResult({
      score: quizScore,
      totalQuestions: quizQuestions.length,
      correctAnswers,
      wrongAnswers,
      categoryScores
    })
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setQuizCompleted(false)
    setUserAnswers(new Array(quizQuestions.length).fill(null))
    setQuizProgress(0)
    setQuizResult(null)
  }

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      'ai-basics': 'AI Basics',
      'deepfake-detection': 'Deepfake Detection',
      'digital-safety': 'Digital Safety',
      'cybersecurity': 'Cybersecurity'
    }
    return names[category] || category
  }

  if (quizCompleted && quizResult) {
    return (
      <div className="min-h-screen bg-white dark:bg-navy py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-navy rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Quiz Complete! 🎉</h1>
              <div className="text-6xl font-bold text-indigo-600 dark:text-orange mb-2">{quizResult.score}%</div>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                You got {quizResult.correctAnswers} out of {quizResult.totalQuestions} questions correct!
              </p>
            </div>

            {/* Digital Safety Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Digital Safety Progress</span>
                <span className="text-sm font-medium text-indigo-600 dark:text-orange">{digitalSafetyScore}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div 
                  className={`bg-gradient-to-r ${getScoreColor()} h-4 rounded-full transition-all duration-500`}
                  style={{ width: `${digitalSafetyScore}%` }}
                ></div>
              </div>
              <div className="mt-2 text-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">{getScoreLevel()}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{getScoreMessage()}</p>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Category Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(quizResult.categoryScores).map(([category, scores]) => (
                  <div key={category} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{getCategoryName(category)}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {scores.correct}/{scores.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-indigo-500 dark:bg-orange h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(scores.correct / scores.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback */}
            <div className="text-center">
              {quizResult.score >= 80 ? (
                <div className="text-green-600 dark:text-green-400">
                  <p className="text-xl font-semibold mb-2">Excellent! 🌟</p>
                  <p>You have a strong understanding of AI, deepfakes, and digital safety!</p>
                </div>
              ) : quizResult.score >= 60 ? (
                <div className="text-yellow-600 dark:text-yellow-400">
                  <p className="text-xl font-semibold mb-2">Good job! 👍</p>
                  <p>You're on the right track! Consider reviewing the areas where you missed questions.</p>
                </div>
              ) : (
                <div className="text-red-600 dark:text-red-400">
                  <p className="text-xl font-semibold mb-2">Keep learning! 📚</p>
                  <p>Don't worry! Digital safety is a complex topic. Review the explanations and try again.</p>
                </div>
              )}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={resetQuiz}
                className="bg-indigo-600 dark:bg-orange text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-orange-600 transition-colors"
              >
                Take Quiz Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-navy py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">AI & Digital Safety Learning Center</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Test your knowledge about AI, deepfakes, and digital safety
          </p>
        </div>

        {/* Quiz Card */}
        <div className="bg-white dark:bg-navy rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-indigo-600 dark:text-orange">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {getCategoryName(quizQuestions[currentQuestion].category)}
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              {quizQuestions[currentQuestion].question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {quizQuestions[currentQuestion].options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === quizQuestions[currentQuestion].correctAnswer
              const isWrong = showResult && isSelected && !isCorrect
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showResult
                      ? isCorrect
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                        : isWrong
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                        : isSelected
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300'
                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      : isSelected
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    {showResult && isCorrect && (
                      <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3" />
                    )}
                    {showResult && isWrong && (
                      <XCircleIcon className="w-6 h-6 text-red-500 mr-3" />
                    )}
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400 dark:border-orange-400">
              <h4 className="font-semibold text-blue-900 dark:text-orange-300 mb-2">Explanation:</h4>
              <p className="text-blue-800 dark:text-blue-200">{quizQuestions[currentQuestion].explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5 mr-2" />
              Back
            </button>
            
            {!showResult ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="bg-indigo-600 dark:bg-orange text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-indigo-600 dark:bg-orange text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-orange-600 transition-colors"
              >
                {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
