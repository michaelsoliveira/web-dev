import z from "zod";

export const unidadeSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(200, "Nome muito longo"),
  codigo_inep: z.string().optional().or(z.literal("")),
  // Endereço
  endereco_id: z.string().optional(),
  cep: z.string().optional().or(z.literal("")),
  logradouro: z.string().min(3, "Logradouro deve ter no mínimo 3 caracteres").max(255, "Logradouro muito longo"),
  numero: z.string().optional().or(z.literal("")),
  bairro: z.string().optional().or(z.literal("")),
  complemento: z.string().optional().or(z.literal("")),
  estado_id: z.string().optional().or(z.literal("")),
  municipio_id: z.string().optional().or(z.literal("")),
});

export type UnidadeFormData = z.infer<typeof unidadeSchema>;

