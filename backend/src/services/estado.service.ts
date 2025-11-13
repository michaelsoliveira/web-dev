import prisma from "@/prisma/client";
import { Estado, Municipio } from "@prisma/client";


export async function list() : Promise<Estado[]> {
    return await prisma.estado.findMany({
        orderBy: {
            uf: 'asc'
        }
    });
}

export async function getEstadoById(id: number) : Promise<Estado | null> {
    try {
        return await prisma.estado.findUnique({
            where: {
                id
            }
        });
    } catch (error) {
        console.error('Error getting estado by id', error);
        return null;
    }
}

export async function create(data: any) : Promise<Estado> {
    const result = await prisma.estado.create({
        data: {
            nome: data.nome,
            uf: data.uf
        }
    })

    return result
}

export async function getMunicipiosByEstado(estado_id: number) {
    return await prisma.municipio.findMany({
        where: {
            estado_id
        },
        orderBy: {
            nome: 'asc'
        }
    })
}

export async function update(id: number, data: Partial<Estado>) {
    
    await prisma.estado.update({
        where: {
            id
        },
        data: {
            nome: data.nome ?? '',
            uf: data.uf ?? ''
        }
    })

    return getEstadoById(id)
}

export async function remove(id: number) {
    await prisma.estado.delete({
        where: { id }
    })
}