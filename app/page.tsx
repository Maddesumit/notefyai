'use client';

import SessionWrapper from './SessionWrapper';
import { useSession, signIn, signOut } from "next-auth/react";

function HomeContent() {
  const { data: session } = useSession();

  return (
    <main>
      {!session ? (
        <button onClick={() => signIn()}>Sign in</button>
      ) : (
        <div>
          <p>Welcome, {session.user?.name}!</p>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      )}
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