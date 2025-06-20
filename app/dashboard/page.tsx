'use client';

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Next.js component for navigation
import SessionWrapper from '../SessionWrapper';

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // State to track uploaded files (useState stores data in component)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      console.log("Dashboard: Sign in successful!", session.user);
    } else if (status === "unauthenticated") {
      console.log("Dashboard: Not authenticated, redirecting to sign in");
      router.push('/signin');
    }
  }, [status, session, router]);

  // Function to handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first selected file
    if (file) {
      // Check if file is PDF, text, or document
      const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        setUploadStatus(`Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      } else {
        setUploadStatus("Please select a PDF, text, or Word document.");
      }
    }
  };

  // Function to handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file first.");
      return;
    }

    setUploadStatus("Uploading...");
    
    // For now, we'll just simulate upload (later we'll add real API)
    setTimeout(() => {
      setUploadedFiles([...uploadedFiles, selectedFile]);
      setUploadStatus(`Successfully uploaded: ${selectedFile.name}`);
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }, 1500);
  };

  if (status === "loading") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4">Loading...</h2>
          <div className="animate-pulse flex justify-center">
            <div className="h-8 w-8 bg-blue-400 rounded-full"></div>
          </div>
        </div>
      </main>
    );
  }

  // If not authenticated, don't render anything (we're redirecting)
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">NotefyAI</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {session?.user?.name || session?.user?.email || 'User'}!
              </span>
              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Study Tools</h2>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard/summaries" className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100 transition">
                    📝 Summaries
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/flashcards" className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100 transition">
                    🃏 Flashcards
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/quizzes" className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100 transition">
                    ❓ Quizzes
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/audio" className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100 transition">
                    🎵 Audio Notes
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/concepts" className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100 transition">
                    🏷️ Key Concepts
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* File Upload Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Upload Your Study Material</h2>
              <p className="text-gray-600 mb-6">
                Upload PDFs, text files, or notes to transform them into interactive study materials.
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition inline-block"
                >
                  Choose File
                </label>
                
                <p className="mt-2 text-sm text-gray-500">
                  PDF, TXT, DOC, DOCX up to 10MB
                </p>
                
                {uploadStatus && (
                  <p className="mt-4 text-sm font-medium text-blue-600">
                    {uploadStatus}
                  </p>
                )}
                
                {selectedFile && (
                  <button
                    onClick={handleFileUpload}
                    className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
                  >
                    Upload File
                  </button>
                )}
              </div>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Your Uploaded Files</h2>
                <div className="space-y-3">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">📄</div>
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)}MB
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition">
                          Process
                        </button>
                        <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/dashboard/summaries" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition">
                  <h3 className="font-medium mb-2">📝 Generate Summaries</h3>
                  <p className="text-sm text-gray-600">Create chapter-wise summaries from your documents</p>
                </Link>
                
                <Link href="/dashboard/flashcards" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition">
                  <h3 className="font-medium mb-2">🃏 Create Flashcards</h3>
                  <p className="text-sm text-gray-600">Generate smart flashcards for key concepts</p>
                </Link>
                
                <Link href="/dashboard/quizzes" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition">
                  <h3 className="font-medium mb-2">❓ Take Quizzes</h3>
                  <p className="text-sm text-gray-600">Test your knowledge with AI-generated quizzes</p>
                </Link>
                
                <Link href="/dashboard/audio" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition">
                  <h3 className="font-medium mb-2">🎵 Audio Notes</h3>
                  <p className="text-sm text-gray-600">Convert your notes to audio for easy listening</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <SessionWrapper>
      <DashboardContent />
    </SessionWrapper>
  );
}
