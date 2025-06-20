'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SessionWrapper from '../../SessionWrapper';

function AudioContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Sample audio notes data
  const [audioNotes] = useState([
    {
      id: 1,
      title: "Chapter 1: Introduction to Biology",
      text: "Biology is the study of living organisms and their interactions with the environment. It encompasses various fields such as botany, zoology, microbiology, and genetics. Understanding biology helps us comprehend how life works at different levels, from molecules to ecosystems.",
      duration: "2:30",
      fileName: "biology_chapter1.mp3",
      createdAt: "2025-06-20"
    },
    {
      id: 2,
      title: "Key Concepts: Cell Structure",
      text: "Cells are the basic units of life. They contain various organelles that perform specific functions. The nucleus controls cell activities, mitochondria produce energy, and the cell membrane controls what enters and exits the cell.",
      duration: "1:45",
      fileName: "cell_structure.mp3",
      createdAt: "2025-06-20"
    }
  ]);
  
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [textToConvert, setTextToConvert] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("en-US");
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/signin');
    }
  }, [status, router]);

  // Simulate audio generation (in real app, this would call text-to-speech API)
  const generateAudio = async () => {
    if (!textToConvert.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      alert("Audio generation completed! In a real app, this would use Text-to-Speech API.");
      setIsGenerating(false);
      setTextToConvert("");
    }, 2000);
  };

  // Simulate audio playback (in real app, would use actual audio files)
  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      // In real app: audioRef.current?.pause()
    } else {
      setIsPlaying(true);
      // In real app: audioRef.current?.play()
      // Simulate playback
      simulatePlayback();
    }
  };

  const simulatePlayback = () => {
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= 150) { // 2:30 duration
          setIsPlaying(false);
          clearInterval(interval);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const seekTo = (percentage: number) => {
    const newTime = (percentage / 100) * 150; // 150 seconds = 2:30
    setCurrentTime(newTime);
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
              <h1 className="text-2xl font-bold text-gray-900">Audio Notes</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Audio Notes List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Your Audio Notes</h2>
                <p className="text-sm text-gray-600 mt-1">Click to play any audio note</p>
              </div>
              
              <div className="divide-y">
                {audioNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNote(note)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                      selectedNote?.id === note.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">🎵</div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{note.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">Duration: {note.duration}</p>
                        <p className="text-xs text-gray-400 mt-2">{note.createdAt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {audioNotes.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  <p>No audio notes yet.</p>
                  <p className="text-sm mt-2">Generate audio from your text below</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Audio Player */}
            {selectedNote && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">{selectedNote.title}</h2>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{selectedNote.duration}</span>
                  </div>
                  <div
                    className="w-full bg-gray-200 rounded-full h-2 cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percentage = ((e.clientX - rect.left) / rect.width) * 100;
                      seekTo(percentage);
                    }}
                  >
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentTime / 150) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center space-x-6 mb-6">
                  <button className="p-2 rounded-full hover:bg-gray-100 transition">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"/>
                    </svg>
                  </button>
                  
                  <button
                    onClick={togglePlayback}
                    className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-700 transition"
                  >
                    {isPlaying ? (
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                    ) : (
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </button>
                  
                  <button className="p-2 rounded-full hover:bg-gray-100 transition">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"/>
                    </svg>
                  </button>
                </div>

                {/* Additional Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <label className="text-sm text-gray-600">Volume:</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-20"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <label className="text-sm text-gray-600">Speed:</label>
                    <select
                      value={playbackRate}
                      onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="0.5">0.5x</option>
                      <option value="0.75">0.75x</option>
                      <option value="1">1x</option>
                      <option value="1.25">1.25x</option>
                      <option value="1.5">1.5x</option>
                      <option value="2">2x</option>
                    </select>
                  </div>
                </div>

                {/* Text Content */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Text Content:</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedNote.text}</p>
                </div>

                {/* Download Button */}
                <div className="mt-4 text-center">
                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                    📥 Download Audio
                  </button>
                </div>
              </div>
            )}

            {/* Text-to-Speech Generator */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Generate New Audio Note</h2>
              <p className="text-gray-600 mb-4">
                Convert your text into audio notes for easy listening while studying or commuting.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voice & Language
                  </label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="en-US">English (US) - Female</option>
                    <option value="en-US-male">English (US) - Male</option>
                    <option value="en-GB">English (UK) - Female</option>
                    <option value="en-AU">English (Australia) - Female</option>
                    <option value="es-ES">Spanish - Female</option>
                    <option value="fr-FR">French - Female</option>
                    <option value="de-DE">German - Female</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text to Convert
                  </label>
                  <textarea
                    value={textToConvert}
                    onChange={(e) => setTextToConvert(e.target.value)}
                    placeholder="Paste your text here to convert it to audio..."
                    rows={6}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {textToConvert.length} characters (recommended: 100-5000 characters)
                  </p>
                </div>
                
                <button
                  onClick={generateAudio}
                  disabled={!textToConvert.trim() || isGenerating}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Audio...
                    </span>
                  ) : (
                    '🎵 Generate Audio Note'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Audio() {
  return (
    <SessionWrapper>
      <AudioContent />
    </SessionWrapper>
  );
}
