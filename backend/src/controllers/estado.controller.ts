import type { Request, Response } from 'express';
import * as EstadoService from '../services/estado.service.js';

export async function list(req: Request, res: Response) {
    const estados = await EstadoService.list();
    res.json(estados);
}

export const getById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const estado = await EstadoService.getEstadoById(id);
    if (!estado) return res.status(404).json({ message: "Estado not found" });
    res.json(estado);
}

export const getMunicipios = async (req: Request, res: Response) => {
    const estado_id = Number(req.params.id);
    const municipios = await EstadoService.getMunicipiosByEstado(estado_id);
    res.json(municipios)
}