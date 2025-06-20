import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import type { NextAuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db();
        const users = db.collection("users");
        const user = await users.findOne({ email: credentials?.email });
        console.log('DEBUG: User found:', user);
        if (user && user.password) {
          const isValid = await bcrypt.compare(
            credentials!.password,
            user.password
          );
          console.log('DEBUG: Password valid:', isValid);
          if (isValid) {
            return { id: user._id.toString(), email: user.email, name: user.name || user.email };
          }
        }
        console.log('DEBUG: Authorization failed for email:', credentials?.email);
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/signin",
    signOut: "/",
    error: "/signin", // Error code passed in query string as ?error=
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log('DEBUG: Session callback invoked with token:', token);
      
      // Ensure session.user exists
      if (!session.user) {
        session.user = {};
      }
      
      // Safely transfer values from token to session
      session.user.email = token.email ? String(token.email) : undefined;
      session.user.name = token.name ? String(token.name) : undefined;
      
      // Add the user ID to the session
      if (token.id) {
        (session.user as any).id = String(token.id);
      }
      
      console.log('DEBUG: Session object after callback:', session);
      return session;
    },
    async jwt({ token, user, account }: { token: JWT; user?: User; account?: any }) {
      console.log('DEBUG: JWT callback invoked with user:', user, 'and account:', account);
      
      // If this is a sign-in, copy the user object properties to the token
      if (user) {
        token.email = user.email || "";
        token.name = user.name || "";
        token.id = user.id || "";
        
        // Log the token after updates
        console.log('DEBUG: Token after user sign-in:', token);
      }
      
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
