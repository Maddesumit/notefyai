'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SessionWrapper from '../../SessionWrapper';

function QuizzesContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Sample quiz data (later from database)
  const [quizzes] = useState([
    {
      id: 1,
      title: "Biology Basics Quiz",
      description: "Test your knowledge of basic biology concepts",
      questions: [
        {
          id: 1,
          question: "What is the powerhouse of the cell?",
          options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
          correctAnswer: 1,
          explanation: "Mitochondria are called the powerhouse of the cell because they produce ATP, the energy currency of the cell."
        },
        {
          id: 2,
          question: "Which process do plants use to make food?",
          options: ["Respiration", "Photosynthesis", "Digestion", "Circulation"],
          correctAnswer: 1,
          explanation: "Photosynthesis is the process by which plants convert sunlight, water, and carbon dioxide into glucose and oxygen."
        },
        {
          id: 3,
          question: "What is the basic unit of heredity?",
          options: ["Cell", "Tissue", "Gene", "Organ"],
          correctAnswer: 2,
          explanation: "Genes are the basic units of heredity, carrying genetic information from parents to offspring."
        }
      ],
      timeLimit: 10, // minutes
      difficulty: "Easy"
    }
  ]);
  
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/signin');
    }
  }, [status, router]);

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizStarted && !quizCompleted) {
      completeQuiz();
    }
  }, [timeLeft, quizStarted, quizCompleted]);

  const startQuiz = (quiz: any) => {
    setSelectedQuiz(quiz);
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
    setQuizCompleted(false);
    setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
    setShowExplanation(false);
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      completeQuiz();
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
    }
  };

  const completeQuiz = () => {
    setQuizCompleted(true);
  };

  const calculateScore = () => {
    let correct = 0;
    selectedQuiz.questions.forEach((question: any, index: number) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: selectedQuiz.questions.length,
      percentage: Math.round((correct / selectedQuiz.questions.length) * 100)
    };
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setQuizCompleted(false);
    setTimeLeft(0);
    setShowExplanation(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
              <h1 className="text-2xl font-bold text-gray-900">Multiple-Choice Quizzes</h1>
            </div>
            {quizStarted && !quizCompleted && (
              <div className="flex items-center space-x-4">
                <div className={`px-4 py-2 rounded-lg font-medium ${
                  timeLeft < 60 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  Time: {formatTime(timeLeft)}
                </div>
                <button
                  onClick={resetQuiz}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
                >
                  Exit Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {!quizStarted ? (
          // Quiz List
          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Available Quizzes</h2>
              <div className="space-y-6">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                        <p className="text-gray-600 mt-1">{quiz.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {quiz.difficulty}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                      <span>📝 {quiz.questions.length} questions</span>
                      <span>⏱️ {quiz.timeLimit} minutes</span>
                    </div>
                    
                    <button
                      onClick={() => startQuiz(quiz)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      Start Quiz
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : quizCompleted ? (
          // Quiz Results
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
              <p className="text-gray-600">Here are your results for "{selectedQuiz.title}"</p>
            </div>
            
            {(() => {
              const score = calculateScore();
              return (
                <div className="mb-8">
                  <div className={`text-6xl font-bold mb-4 ${
                    score.percentage >= 80 ? 'text-green-600' :
                    score.percentage >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {score.percentage}%
                  </div>
                  <p className="text-xl text-gray-700">
                    You got {score.correct} out of {score.total} questions correct
                  </p>
                  
                  <div className={`inline-block px-6 py-3 rounded-lg mt-4 ${
                    score.percentage >= 80 ? 'bg-green-100 text-green-800' :
                    score.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {score.percentage >= 80 ? '🎉 Excellent!' :
                     score.percentage >= 60 ? '👍 Good job!' :
                     '📚 Keep studying!'}
                  </div>
                </div>
              );
            })()}
            
            {/* Review Answers */}
            <div className="mb-8 text-left">
              <h3 className="text-lg font-semibold mb-4">Review Your Answers</h3>
              <div className="space-y-4">
                {selectedQuiz.questions.map((question: any, index: number) => {
                  const isCorrect = selectedAnswers[index] === question.correctAnswer;
                  return (
                    <div key={question.id} className={`border rounded-lg p-4 ${
                      isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <span className={`text-lg ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {isCorrect ? '✅' : '❌'}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                          <p className="text-sm text-gray-600 mb-2">
                            Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {question.options[selectedAnswers[index]] || 'No answer selected'}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-green-600 mb-2">
                              Correct answer: {question.options[question.correctAnswer]}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => startQuiz(selectedQuiz)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Retake Quiz
              </button>
              <button
                onClick={resetQuiz}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
              >
                Back to Quizzes
              </button>
            </div>
          </div>
        ) : (
          // Quiz Taking Interface
          <div>
            {/* Progress */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
                </span>
                <span className="text-sm text-gray-600">
                  Progress: {Math.round(((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-lg shadow p-8 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {selectedQuiz.questions[currentQuestionIndex].question}
              </h2>
              
              <div className="space-y-3">
                {selectedQuiz.questions[currentQuestionIndex].options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium text-gray-700">
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                  </button>
                ))}
              </div>
              
              {selectedAnswers[currentQuestionIndex] !== -1 && !showExplanation && (
                <button
                  onClick={() => setShowExplanation(true)}
                  className="mt-4 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Show explanation
                </button>
              )}
              
              {showExplanation && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Explanation:</strong> {selectedQuiz.questions[currentQuestionIndex].explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <button
                onClick={nextQuestion}
                disabled={selectedAnswers[currentQuestionIndex] === -1}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestionIndex === selectedQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Quizzes() {
  return (
    <SessionWrapper>
      <QuizzesContent />
    </SessionWrapper>
  );
}
