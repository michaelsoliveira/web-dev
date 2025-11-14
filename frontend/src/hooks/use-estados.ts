import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useClient from "./use-client";
import { da } from "zod/v4/locales";

type EstadosResponse = {
    estados: Array<
        {
            id: number;
            uf: string;
            nome: string;
        }
    >;
};

export function useEstados(params = {}) {
  const api = useClient();

  return useQuery<EstadosResponse>({
    queryKey: ['estados', params],
    queryFn: async () => {
      const { data } = await api.get('/estados', { params });
      return data;
    },
  });
}

export function useMunicipiosByEstado(onSuccess?: (municipios: any) => void) {
  const api = useClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (estadoId: number) => {
      const { data } = await api.get(`/estados/${estadoId}/municipios`);
      return data;
    },
    onSuccess: (municipios) => {
        if (onSuccess) {
            onSuccess(municipios);
            queryClient.invalidateQueries({ queryKey: ['municipios-estado'] });
        }
    },
    onError: (error) => {
        console.error('Error fetching municipios by estado:', error);
    }
  });
}