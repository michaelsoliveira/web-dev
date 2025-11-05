import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { User } from "@prisma/client";
import { getById } from '../services/users.service'

export const Authentication = () => {
    return async (request: Request, response: Response, next: NextFunction) => {
        const { authorization } = request.headers;

        if (!authorization) {
            return response.status(401). json({ error: 'Token is missing' });
        }

        const token = authorization.replace('Bearer', '').trim();

        const verificationResponse = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as User;
        const user = await getById(verificationResponse.id);
        if (user) {
            request.user = {
                id: user?.id,
                email: user?.email,
                username: user?.name ?? ''
            }   
        }
        return next();
    }
}