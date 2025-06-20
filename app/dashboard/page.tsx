'use client';

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SessionWrapper from '../SessionWrapper';

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      console.log("Dashboard: Sign in successful!", session.user);
    } else if (status === "unauthenticated") {
      console.log("Dashboard: Not authenticated, redirecting to sign in");
      router.push('/signin');
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

  // If not authenticated, don't render anything (we're redirecting)
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">NotefyAI Dashboard</h1>
        <p className="text-xl font-medium mb-4">
          Welcome, {session?.user?.name || session?.user?.email || 'User'}!
        </p>
        <p className="text-gray-600 mb-6">
          You've successfully signed in to your account.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <p className="text-sm text-gray-500 mb-2">Session details:</p>
          <pre className="text-xs overflow-auto">{JSON.stringify(session, null, 2)}</pre>
        </div>
        
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
        >
          Sign out
        </button>
      </div>
    </main>
  );
}

export default function Dashboard() {
  return (
    <SessionWrapper>
      <DashboardContent />
    </SessionWrapper>
  );
}
