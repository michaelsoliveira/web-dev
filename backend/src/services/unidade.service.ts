import prisma from "@/prisma/client";
import { UnidadeEscolar } from "@prisma/client";

type UnidadeCreateRequest = {
    nome: string;
    codigo_inep: string;
    endereco: {
        cep: string;
        logradouro: string;
        bairro: string;
        municipio_id: number;
        estado_id: number;
        complemento: string;
        numero: string;
    }
}

export async function list() : Promise<{data: UnidadeEscolar[], count: number}> {
    const [data, count] = await prisma.$transaction([
        prisma.unidadeEscolar.findMany({
            include: {
                endereco: true
            },
            orderBy: {
                nome: 'asc'
            }
        }),
        prisma.unidadeEscolar.count()
    ]);
    return {
        data,
        count
    }
}

export async function getUnidadeById(id: string) : Promise<UnidadeEscolar | null> {
    try {
        return await prisma.unidadeEscolar.findUnique({
            where: {
                id
            }
        });
    } catch (error) {
        console.error('Error getting unidade by id', error);
        return null;
    }
}

export async function create(data: UnidadeCreateRequest) : Promise<UnidadeEscolar> {
    const result = await prisma.unidadeEscolar.create({
        data: {
            nome: data.nome,
            codigo_inep: data.codigo_inep,
            endereco: {
                create: {
                    cep: data.endereco.cep,
                    logradouro: data.endereco.logradouro,
                    numero: data.endereco.numero,
                    bairro: data.endereco.bairro,
                    complemento: data.endereco.complemento,
                    municipio_id: data.endereco.municipio_id,
                    estado_id: data.endereco.estado_id
                }
            }
        }
    })

    return result
}

export async function update(id: string, data: Partial<UnidadeCreateRequest>) {
    const { endereco, ...unidadeData } = data;
    
    const updateData: any = { ...unidadeData };
    
    if (endereco) {
        updateData.endereco = {
            update: endereco
        };
    }
    
    await prisma.unidadeEscolar.update({
        where: {
            id
        },
        data: updateData
    })

    return getUnidadeById(id)
}

export async function remove(id: string) {
    await prisma.unidadeEscolar.delete({
        where: { id }
    })
}