import prisma from '../prisma/client.js';
import bcrypt from 'bcrypt'
type User = {
    email?: string;
    name?: string | null;
    password?: string;
    image?: string | null
}

export async function list() {
    return prisma.user.findMany({ orderBy: { id: 'asc' } });
}

export async function getById(id: string) {
    return prisma.user.findUnique({ where: { id } })
}

export async function create(
    data: { email: string; name?: string | null; password: string, image?: string | null}
) {
    const hashed = await bcrypt.hash(data.password, 10);
    return prisma.user.create({ 
        data: {
            ...data,
            password: hashed
        }
    });
}

export async function update(id: string, data: User) {
    return prisma.user.update({
        where: { id },
        data
    });
}

export async function remove(id: string) {
    return prisma.user.delete({ where: { id } })
}
