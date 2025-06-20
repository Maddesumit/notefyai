'use client';

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SessionWrapper from './SessionWrapper';

function HomeContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("Home: Current session status:", status);
    
    if (status === "authenticated" && session?.user) {
      console.log("Home: Sign in successful, redirecting to dashboard");
      router.push('/dashboard');
    }
  }, [status, session, router]);

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome to NotefyAI</h1>
        <p className="mb-6 text-gray-600 text-center">
          Transform your textbooks, notes, and PDFs into interactive study material using AI
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/signin"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition text-center"
          >
            Sign In
          </Link>
          
          <Link 
            href="/signup" 
            className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition text-center"
          >
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <SessionWrapper>
      <HomeContent />
    </SessionWrapper>
  );
}