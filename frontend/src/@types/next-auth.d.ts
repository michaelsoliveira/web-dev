import NextAuth, { DefaultSession } from "next-auth";

declare module 'next-auth' {
    interface Session {
        expires: string;
        user: {
            id: string;
            name: string;
            email: string;
            image: string;
        }
        accessToken?: string;
    }

    interface CredentialsInputs {
        email: string;
        password: string;
    }
}