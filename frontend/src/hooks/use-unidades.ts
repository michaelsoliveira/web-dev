'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useClient from './use-client';

export interface UnidadeEscolar {
  id: string;
  nome: string;
  codigo_inep?: string;
  created_at: string;
  updated_at: string;
  endereco?: {
    id: string;
    cep?: string;
    logradouro: string;
    numero?: string;
    bairro?: string;
    complemento?: string;
    estado?: {
      id: number;
      uf: string;
      nome: string;
    };
    municipio?: {
      id: number;
      nome: string;
    };
  };
}

interface UnidadesResponse {
  unidades: UnidadeEscolar[];
  count: number;
}

interface UnidadeParams {
  search?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

export const useUnidades = (params?: UnidadeParams) => {
  const api = useClient();

  return useQuery<UnidadesResponse>({
    queryKey: ['unidades', params],
    queryFn: async () => {
      const { data } = await api.get('/unidade-escolar', { params });
      return data;
    },
  });
};

export const useUnidade = (id: string) => {
  const api = useClient();

  return useQuery<UnidadeEscolar>({
    queryKey: ['unidade', id],
    queryFn: async () => {
      const { data } = await api.get(`/unidade-escolar/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateUnidade = () => {
  const api = useClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { data: response } = await api.post('/unidade-escolar', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidades'] });
    },
  });
};

export const useUpdateUnidade = () => {
  const api = useClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: response } = await api.put(`/unidade-escolar/${id}`, data);
      return response;
    },
    onSuccess: (_, variables) => {
      variables.id
      queryClient.invalidateQueries({ queryKey: ['unidade', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['unidades'] });
    },
  });
};

export const useDeleteUnidade = () => {
  const api = useClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/unidade-escolar/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidades'] });
    },
  });
};

