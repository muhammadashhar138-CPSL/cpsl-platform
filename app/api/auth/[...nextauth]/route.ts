import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Determine the correct URL based on environment
const getAuthUrl = () => {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  // Fallback for development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  // Fallback for production (should use env var)
  return 'https://cpsl-one.vercel.app';
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'test@cpsl.co.uk' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Test account hardcoded for demo
        const testEmail = process.env.TEST_ACCOUNT_EMAIL || 'test@cpsl.co.uk';
        const testPassword = process.env.TEST_ACCOUNT_PASSWORD || 'demo123456';

        if (credentials?.email === testEmail && credentials?.password === testPassword) {
          return {
            id: 'test-user-1',
            name: 'Test User',
            email: testEmail,
            role: 'admin',
          };
        }

        // TODO: Add real database authentication here
        // For now, only test account works
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
