'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SessionWrapper from '../../SessionWrapper';

function FlashcardsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Sample flashcards data (later from database)
  const [flashcards] = useState([
    {
      id: 1,
      question: "What is the basic unit of life?",
      answer: "Cell - Cells are the smallest structural and functional units of living organisms.",
      subject: "Biology",
      difficulty: "Easy",
      isKnown: false
    },
    {
      id: 2,
      question: "What is photosynthesis?",
      answer: "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.",
      subject: "Biology",
      difficulty: "Medium",
      isKnown: false
    },
    {
      id: 3,
      question: "What is DNA?",
      answer: "DNA (Deoxyribonucleic Acid) is the hereditary material that contains genetic instructions for the development of living organisms.",
      subject: "Biology",
      difficulty: "Medium",
      isKnown: true
    }
  ]);
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/signin');
    }
  }, [status, router]);

  const currentCard = flashcards[currentCardIndex];
  
  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };
  
  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };
  
  const toggleCard = () => {
    setIsFlipped(!isFlipped);
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Smart Flashcards</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {currentCardIndex + 1} of {flashcards.length}
              </span>
              <button
                onClick={() => setStudyMode(!studyMode)}
                className={`px-4 py-2 rounded-md text-sm transition ${
                  studyMode 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {studyMode ? 'Exit Study Mode' : 'Study Mode'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {!studyMode ? (
          // Card List View
          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Your Flashcards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashcards.map((card, index) => (
                  <div
                    key={card.id}
                    onClick={() => {
                      setCurrentCardIndex(index);
                      setStudyMode(true);
                    }}
                    className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        card.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        card.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {card.difficulty}
                      </span>
                      <span className={`text-sm ${card.isKnown ? 'text-green-600' : 'text-gray-500'}`}>
                        {card.isKnown ? '✓ Known' : '○ Unknown'}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-3">
                      {card.question}
                    </h3>
                    <p className="text-sm text-gray-600">{card.subject}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => setStudyMode(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-medium"
              >
                Start Studying
              </button>
            </div>
          </div>
        ) : (
          // Study Mode
          <div className="max-w-2xl mx-auto">
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(((currentCardIndex + 1) / flashcards.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentCardIndex + 1) / flashcards.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Flashcard */}
            <div className="mb-8">
              <div
                onClick={toggleCard}
                className={`relative w-full h-80 cursor-pointer transition-transform duration-500 transform-style-preserve-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front of card (Question) */}
                <div className={`absolute inset-0 w-full h-full bg-white rounded-lg shadow-lg border-2 border-blue-200 backface-hidden ${
                  isFlipped ? 'opacity-0' : 'opacity-100'
                } transition-opacity duration-300`}>
                  <div className="p-8 h-full flex flex-col justify-center">
                    <div className="text-center mb-4">
                      <span className="text-sm text-blue-600 font-medium">QUESTION</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 text-center leading-relaxed">
                      {currentCard?.question}
                    </h2>
                    <div className="mt-auto text-center">
                      <p className="text-sm text-gray-500">Click to reveal answer</p>
                    </div>
                  </div>
                </div>
                
                {/* Back of card (Answer) */}
                <div className={`absolute inset-0 w-full h-full bg-green-50 rounded-lg shadow-lg border-2 border-green-200 backface-hidden ${
                  isFlipped ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-300`}>
                  <div className="p-8 h-full flex flex-col justify-center">
                    <div className="text-center mb-4">
                      <span className="text-sm text-green-600 font-medium">ANSWER</span>
                    </div>
                    <p className="text-lg text-gray-900 text-center leading-relaxed">
                      {currentCard?.answer}
                    </p>
                    <div className="mt-auto text-center">
                      <p className="text-sm text-gray-500">Click to flip back</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={prevCard}
                className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
              >
                <span>← Previous</span>
              </button>
              
              <div className="flex space-x-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                  ❌ Don't Know
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                  ✅ I Know This
                </button>
              </div>
              
              <button
                onClick={nextCard}
                className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
              >
                <span>Next →</span>
              </button>
            </div>

            {/* Card Info */}
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="flex justify-center space-x-6 text-sm">
                <span className="text-gray-600">Subject: <strong>{currentCard?.subject}</strong></span>
                <span className="text-gray-600">Difficulty: <strong>{currentCard?.difficulty}</strong></span>
                <span className={currentCard?.isKnown ? 'text-green-600' : 'text-orange-600'}>
                  Status: <strong>{currentCard?.isKnown ? 'Known' : 'Learning'}</strong>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Flashcards() {
  return (
    <SessionWrapper>
      <FlashcardsContent />
    </SessionWrapper>
  );
}
