'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SessionWrapper from '../../SessionWrapper';

function SummariesContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // State for summaries (later we'll get this from database)
  const [summaries, setSummaries] = useState([
    {
      id: 1,
      title: "Chapter 1: Introduction to Biology",
      content: "Biology is the study of living organisms and their interactions with the environment...",
      fileName: "biology_textbook.pdf",
      createdAt: "2025-06-20"
    },
    {
      id: 2,
      title: "Chapter 2: Cell Structure",
      content: "Cells are the basic units of life. They contain various organelles that perform specific functions...",
      fileName: "biology_textbook.pdf",
      createdAt: "2025-06-20"
    }
  ]);
  
  const [selectedSummary, setSelectedSummary] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/signin');
    }
  }, [status, router]);

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
              <h1 className="text-2xl font-bold text-gray-900">Chapter Summaries</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Summaries List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Available Summaries</h2>
                <p className="text-sm text-gray-600 mt-1">Click on a summary to read it</p>
              </div>
              
              <div className="divide-y">
                {summaries.map((summary) => (
                  <div
                    key={summary.id}
                    onClick={() => setSelectedSummary(summary)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                      selectedSummary?.id === summary.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                    }`}
                  >
                    <h3 className="font-medium text-gray-900">{summary.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">From: {summary.fileName}</p>
                    <p className="text-xs text-gray-400 mt-2">{summary.createdAt}</p>
                  </div>
                ))}
              </div>
              
              {summaries.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  <p>No summaries yet.</p>
                  <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 text-sm">
                    Upload a file to get started
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Summary Content */}
          <div className="lg:col-span-2">
            {selectedSummary ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-900">{selectedSummary.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    From: {selectedSummary.fileName} • Created: {selectedSummary.createdAt}
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedSummary.content}
                    </p>
                  </div>
                  
                  <div className="mt-8 flex space-x-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                      📋 Copy Summary
                    </button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
                      📥 Download PDF
                    </button>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
                      🎵 Convert to Audio
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Summary</h3>
                <p className="text-gray-500">Choose a summary from the list to read its content</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Summaries() {
  return (
    <SessionWrapper>
      <SummariesContent />
    </SessionWrapper>
  );
}
