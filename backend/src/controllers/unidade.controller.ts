import type { Request, Response } from 'express';
import * as UnidadeService from '../services/unidade.service.js';

export async function list(req: Request, res: Response) {
    const { data: unidades, count } = await UnidadeService.list();
    res.json({
        unidades,
        count
    });
}

export const getById = async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const unidade = await UnidadeService.getUnidadeById(id);
    if (!unidade) return res.status(404).json({ message: "Unidade not found" });
    res.json(unidade);
}

export const create = async (req: Request, res: Response) => {
    const { nome, codigo_inep, endereco } = req.body;
    if (!nome) {
        return res.status(400).json({
            message: 'nome é obrigatório obrigatórios'
        });
    }
    const unidade = await UnidadeService.create({
        nome, codigo_inep, endereco
    });
    res.status(201).json(unidade);
}

export const update = async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const { nome, codigo_inep, endereco } = req.body;
    try {
        const unidade = await UnidadeService.update(
            id, { nome, codigo_inep, endereco }
        );
        res.json(unidade);
    } catch (error: any) {
        if (error?.code === 'P2025') {
            return res.status(404).json({ message: 'Unidade not found' });
        }
        throw error;
    }
}

export const remove = async (req: Request, res: Response) => {
    const id = String(req.params.id);
    try {
        await UnidadeService.remove(id);
        res.status(204).send();
    } catch (error: any) {
        if (error?.code === 'P2025') {
            return res.status(404).json({ message: 'Unidade not found' });
        }
        throw error;
    }
}