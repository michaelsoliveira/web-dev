import { Request, Response } from "express";
import authService from "@/services/auth.service";

export class AuthController {
    async login(request: Request, response: Response): Promise<Response> {
        const { email, password } = request.body;

        try {
            const user = await authService.execute({ email, password });

            return response.json({
                error: false,
                message: null,
                ...user
            })
        } catch (error: any) {
            return response.json({
                error: true,
                message: error.message,
                user: null
            })
        }
    }
}