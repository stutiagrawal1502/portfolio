import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

// Support comma-separated list of allowed emails, e.g. "a@b.com,c@d.com"
const ALLOWED_EMAILS: string[] = (
  process.env.ALLOWED_EMAIL ?? 'stutiagrawal1402@gmail.com'
)
  .split(',')
  .map(e => e.trim())
  .filter(Boolean)

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email && ALLOWED_EMAILS.includes(user.email)) return true
      return false
    },
    async session({ session }) {
      return session
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
}
