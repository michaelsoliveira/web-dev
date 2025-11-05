'use server';

import { revalidatePath } from "next/cache";
import { UnidadeFormData } from "@/features/unidade/utils/form-schema";

export const createUnidade = async (data: UnidadeFormData) => {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/unidade-escolar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  revalidatePath("/dashboard/unidade");
};

export const updateUnidade = async (id: string, data: UnidadeFormData) => {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/unidade-escolar/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  revalidatePath("/dashboard/unidade");
  revalidatePath(`/dashboard/unidade/${id}`);
};

export const deleteUnidade = async (id: string) => {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/unidade-escolar/${id}`, {
    method: 'DELETE',
  });

  revalidatePath("/dashboard/unidade");
};
