'use server';

import { revalidatePath } from "next/cache";
import { ClienteFormData } from "@/features/cliente/utils/form-schema";

const createCliente = async (data: ClienteFormData) => {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cliente`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  // Revalidate the path to update the cliente list

  revalidatePath("/dashboard/cliente");
};

export { createCliente };