import z from "zod";

export const clienteSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100, "Nome muito longo"),
  email: z.string().email("Email inválido").max(255, "Email muito longo"),
  telefone: z.string().min(10, "Telefone inválido").max(15, "Telefone inválido"),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  endereco: z.string().min(5, "Endereço deve ter no mínimo 5 caracteres").max(200, "Endereço muito longo"),
  cidade: z.string().min(3, "Cidade inválida").max(100, "Cidade muito longa"),
  estado: z.string().length(2, "Use a sigla do estado (ex: SP)"),
  cep: z.string().min(8, "CEP inválido").max(9, "CEP inválido"),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;