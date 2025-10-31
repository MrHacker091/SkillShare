import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Store user info in JWT token
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
        token.role = 'CUSTOMER' // Default role for all users
        token.isCreator = false
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
      // Allow Google sign in
      if (account?.provider === 'google') {
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

// Re-export NextAuth client utilities
export { SessionProvider as AuthProvider, useSession } from "next-auth/react"
