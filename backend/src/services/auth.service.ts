import { User } from "@prisma/client";
import prisma from '../prisma/client';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export interface UserRequest {
    email: string,
    password: string
}

export interface DataStoredInToken extends UserRequest{
    id: string
}

interface TokenData {
    access_token: string,
    expires_in: number
}

class AuthService {
    public async execute({ email, password: pwd }: UserRequest) {
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            throw new Error('User not found')
        }

        const passwordMatch = await bcrypt.compare(pwd, user.password)

        if (!passwordMatch) {
            throw new Error('Invalid password')
        }

        const expiresIn = 60 * 60 // 1 hour
        const secretKey = process.env.JWT_SECRET || 'secret'
        const dataStoredInToken = {
            id: user.id,
            email: user.email
        }
        const token = jwt.sign(dataStoredInToken, secretKey, { expiresIn })

        const tokenData: TokenData = {
            access_token: token,
            expires_in: expiresIn
        }

        const { password, ...userData } = user

        return { user: userData, ...tokenData }
    }
}

export default new AuthService()
