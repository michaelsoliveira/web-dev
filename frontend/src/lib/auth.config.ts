import Credentials from "next-auth/providers/credentials";
import z from "zod";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = loginSchema.safeParse(credentials);

                if (!validatedFields.success) {
                    return null;
                }

                const { email, password } = validatedFields.data;

                try {
                    const response = await fetch(`${apiUrl}/api/auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password })
                    });

                    if (!response.ok) {
                        return null;
                    }

                    const user = await response.json();

                    if (user) {
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            accessToken: user?.tokenData?.accessToken
                        };
                    } else {
                        return null;
                    }
                } catch (error: any) {
                    console.log('Error na autenticação: ', error.message);
                    return null;
                }
            },
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" }
            }
        })
    ]
}