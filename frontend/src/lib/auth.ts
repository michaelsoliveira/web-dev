import NextAuth from 'next-auth';
import authConfig from './auth.config';

export const { auth, handlers, signOut, signIn } = NextAuth({
    session: {
        strategy: 'jwt',
    },
    ...authConfig,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.name = user.name
                token.email = user.email
            }
            return token
        },
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id as string
                session.user.name = token.name as string
                session.user.email = token.email as string
                session.user.image = token.image as string
                session.accessToken = token.accessToken as string
            }
            return session
        }
    },
    pages: {
        signIn: '/'
    }
})