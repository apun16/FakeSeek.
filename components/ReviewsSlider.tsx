'use client'

import { useState, useEffect } from 'react'

const ReviewsSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Journalist",
      content: "FakeSeek has revolutionized how I view my own social media presence. The deepfake and privacy analysis is incredibly accurate and makes me feel more informed about my digital identity.",
      rating: 5,
      avatar: "SJ"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Educator",
      content: "As a teacher, I use FakeSeek to help students develop online safety skills. The prevention resources are invaluable for media literacy education.",
      rating: 5,
      avatar: "MC"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      role: "Researcher",
      content: "The precision of FakeSeek's detection algorithms is remarkable. It's become an essential tool in my research on deepfakes and womens privacy breaches.",
      rating: 5,
      avatar: "ER"
    },
    {
      id: 4,
      name: "James Wilson",
      role: "Content Creator",
      content: "I rely on FakeSeek daily to ensure the content I share is credible. The real-time scanning feature is a game-changer for content creators, making sure no one is pretending to be us.",
      rating: 5,
      avatar: "JW"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Social Media Manager",
      content: "FakeSeek helps me maintain the integrity of our brand's social media presence. The prevention tools have significantly improved our content strategy, by helping us practise for deepfakes and phishing attacks.",
      rating: 5,
      avatar: "LT"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % reviews.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [reviews.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % reviews.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main slider container */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange/20 to-orange/10 backdrop-blur-sm border border-orange/20">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {reviews.map((review) => (
            <div key={review.id} className="w-full flex-shrink-0 px-8 py-12">
              <div className="text-center">
                {/* Avatar */}
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange/20 to-orange/10 rounded-full flex items-center justify-center text-2xl font-bold text-orange border-2 border-orange/30">
                  {review.avatar}
                </div>
                
                {/* Rating stars */}
                <div className="flex justify-center mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-6 h-6 text-orange"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Review content */}
                <blockquote className="text-xl font-inter text-black/90 dark:text-white mb-8 leading-relaxed max-w-2xl mx-auto">
                  "{review.content}"
                </blockquote>

                {/* Reviewer info */}
                <div>
                  <h4 className="text-lg font-oswald font-bold text-black dark:text-white mb-1">
                    {review.name}
                  </h4>
                  <p className="text-orange font-inter text-sm">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-orange/20 hover:bg-orange/30 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-orange/20 hover:bg-orange/30 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center mt-8 space-x-2">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-orange scale-125'
                : 'bg-orange/30 hover:bg-orange/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default ReviewsSlider