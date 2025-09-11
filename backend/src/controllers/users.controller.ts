import type { Request, Response } from 'express';
import * as UsersService from '../services/users.service.js';

export async function list(req: Request, res: Response) {
    const users = await UsersService.list();
    res.json(users);
}

export const getById = async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const user = await UsersService.getById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
}

export const create = async (req: Request, res: Response) => {
    const { email, name, password, image } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: 'email e password são obrigatórios'
        });
    }
    const user = await UsersService.create({
        email, name, password, image
    });
    res.status(201).json(user);
}

export const update = async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const { email, name, password } = req.body;
    try {
        const user = await UsersService.update(
            id, { email, name, password }
        );
        res.json(user);
    } catch (error: any) {
        if (error?.code === 'P2025') {
            return res.status(404).json({ message: 'User not found' });
        }
        throw error;
    }
}

export const remove = async (req: Request, res: Response) => {
    const id = String(req.params.id);
    try {
        const user = await UsersService.remove(id);
        res.status(204).send();
    } catch (error: any) {
        if (error?.code === 'P2025') {
            return res.status(404).json({ message: 'User not found' });
        }
        throw error;
    }
}