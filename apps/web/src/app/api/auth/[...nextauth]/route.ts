import { creatorUsers, customerUsers } from '@/lib/storage'
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { cookies } from 'next/headers'

// Create the NextAuth handler with JWT strategy (no database required)
const { handlers: { GET, POST } } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;
        const userType = credentials.userType as string;

        if (userType === 'creator') {
          // Check creator users
          const user = creatorUsers.get(email);
          if (user && user.password === password) {
            return {
              id: email,
              email: user.email,
              name: user.name,
              image: null,
              role: 'CREATOR',
              isVerified: user.isVerified
            };
          }
        } else if (userType === 'customer') {
          // Check customer users
          const user = customerUsers.get(email);
          if (user && user.password === password) {
            return {
              id: email,
              email: user.email,
              name: user.name,
              image: null,
              role: 'CUSTOMER',
              isVerified: user.isVerified
            };
          }
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account, profile, trigger }) {
      // Store user info in JWT token
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image

        // Set role based on login method
        if (account?.provider === 'credentials') {
          token.role = user.role || 'CREATOR'
          token.isCreator = true
        } else if (account?.provider === 'google') {
          // Check for pendingUserType cookie to determine role
          const cookieStore = await cookies();
          const pendingUserType = cookieStore.get('pendingUserType')?.value;
          
          if (pendingUserType === 'creator') {
            token.role = 'CREATOR'
            token.isCreator = true
          } else {
            token.role = 'CUSTOMER'
            token.isCreator = false
          }
          
          // Clear the cookie after reading it
          cookieStore.delete('pendingUserType');
        }
      }
      
      // Handle session updates from client
      if (trigger === 'update' && token) {
        // Allow role updates from RoleInitializer
        return token;
      }
      
      return token
    },
    async session({ session, token }) {
      // Add user info from JWT token to session
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
        session.user.role = token.role as string || 'CUSTOMER'
        session.user.isCreator = token.isCreator as boolean || false
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Allow Google sign in for customers
      if (account?.provider === 'google') {
        return true
      }

      // Allow credentials sign in for creators
      if (account?.provider === 'credentials') {
        return true
      }

      return false
    }
  },
  session: {
    strategy: "jwt"
  },
  debug: process.env.NODE_ENV === 'development',
})

export { GET, POST }
